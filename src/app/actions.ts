"use server";
import ILoginInfo from '@/interfaces/ILoginInfo';
import IRegisterInfo from '@/interfaces/IRegisterInfo';
import { exec, execSync } from 'child_process';
import fs from 'fs'
import { cookies } from 'next/headers';
import path from 'path';
import {v4} from 'uuid';
import crypto from 'crypto';
import { stderr } from 'process';

export async function readUsers() {
    try {
      const files = await fs.promises.readdir("/etc/ldap");
      return files.filter((file) => file.split(".")[1] === "ldif");
    } catch (error) {
      console.error('Error al leer el directorio:', error);
      return [];
    }
  }



export async function usernameExists(username: string){
    try{
        username = username.trim().toLowerCase();
        const users = await readUsers()
        return users.includes(`${username}.ldif`);
    }
    catch(error){
        console.error(error);
    }
}

export async function login({username, password}: ILoginInfo){
    const isUsernameExists = await usernameExists(username);
    if (!isUsernameExists) return false;
    setCookie(username);
    return password === await checkUserPassword(username) ? true : false
}
export async function setCookie(username: string) {
    const encodedUsername = await encodeAccount(username);
    cookies().set({
        name: "token",
        value: encodedUsername,
        httpOnly: true,
        path: "/",
    });
    cookies().set({
        name: "username",
        value: username,
        httpOnly: true,
        path: "/",
    });
}
export async function deleteCookies() {
    cookies().delete("token");
    cookies().delete("username");

}
export async function encodeAccount(username: string){
    const secretKey = Buffer.from(process.env.SECRET_KEY ?? '', 'hex'); 
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, Buffer.alloc(16));


    const encryptedUsername = cipher.update(username, 'utf8', 'hex');

    const encryptedUsernameFinal = encryptedUsername + cipher.final('hex');

    return encryptedUsernameFinal;
}

export async function decodeAccount(encryptedUsername: string): Promise<string> {
    const secretKey = Buffer.from(process.env.SECRET_KEY || '', 'hex'); 

    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, Buffer.alloc(16));

    const decryptedUsername = decipher.update(encryptedUsername, 'hex', 'utf8');

    const decryptedUsernameFinal = decryptedUsername + decipher.final('utf8');

    return decryptedUsernameFinal;
}

export async function changePassword(username: string, newPassword: string){
    try {
        const isUsernameExists = await usernameExists(username);
        if (!isUsernameExists) {
            console.error(`El usuario ${username} no existe`);
            return false;
        }

        const content = await fs.promises.readFile(`/etc/ldap/${username}.ldif`, 'utf-8');
        if (!content) {
            console.error(`No se pudo obtener el contenido del archivo para el usuario ${username}`);
            return false;
        }

        const userPassword = await getPassword(content);
        if (!userPassword) {
            console.error(`No se pudo obtener la contraseña para el usuario ${username}`);
            return false;
        }

        const updatedContent = content.replace(`userPassword: ${userPassword}`, `userPassword: ${newPassword}`);
        await fs.promises.writeFile(`/etc/ldap/${username}.ldif`, updatedContent, 'utf-8');
        const ldapCommand = `ldappasswd -x -D "cn=admin,dc=ldapmss245,dc=eastus,dc=cloudapp,dc=azure,dc=com" -w "${process.env.LDAP_PASSWORD}" -S "cn=${username},ou=Personal,dc=ldapmss245,dc=eastus,dc=cloudapp,dc=azure,dc=com" -s "${newPassword}"`;
        exec(ldapCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(
                    `Error ejecutando el comando: ${error.message}`
                );
                return false;
            }
            if (stderr) {
                console.error(`Error en el comando: ${stderr}`);
                return false;
            }
        })

        return true;
    } catch (error) {
        console.error(`Error al cambiar la contraseña para el usuario ${username}:`, error);
        return false;
    }
}


export async function getPassword(content: string): Promise<string | null> {
    try {
        const lines = content.split('\n');
        let userPassword;
        for (const line of lines) {
            const parts = line.split(':');
            if (parts[0].trim() === 'userPassword') {
                userPassword = parts[1].trim();
                break; 
            }
        }
        if(!userPassword) return null;
        return userPassword;
    } catch (error) {
        return null;
    }
}

export async function checkUserPassword(username: string): Promise<string | null> {
    try {
        const content = await fs.promises.readFile(`/etc/ldap/${username}.ldif`, 'utf-8');
        if (!content) return null;
        const password = await getPassword(content)
        return password;
    } catch (error) {
        console.error('Error reading the file:', error);
        return null;
    }
}


export async function isCookieValid(){
    const username = cookies().get("username")?.value;
    if (!username) return false;
    const token = cookies().get("token")?.value;
    if(!token) return false;
    const encoded = await encodeAccount(username);
    return encoded === token ? username : false
}

export async function createUser({name, username, password}: IRegisterInfo){
    function getRandomIntInclusive(min: number, max: number) {
        min = Math.ceil(min); // Asegura que min sea el siguiente entero más grande si no es un entero
        max = Math.floor(max); // Asegura que max sea el mayor entero menor o igual a max
        return Math.floor(Math.random() * (max - min + 1)) + min; //El máximo es inclusivo y el mínimo es inclusivo
    }

    try {
        username = username.trim().toLowerCase();
        const isTaken = await usernameExists(username);
        if(isTaken) return false;
        const uuid = getRandomIntInclusive(1, 1000000);
        const accountInfo = `dn: cn=${username},ou=Personal,dc=ldapmss245,dc=eastus,dc=cloudapp,dc=azure,dc=com\n` +
        `objectClass: top\n` +
        `objectClass: account\n` +
        `objectClass: posixAccount\n` +
        `objectClass: shadowAccount\n` +
        `cn: ${username}\n` +
        `uid: ${username}\n` +
        `uidNumber: ${uuid}\n` +
        `gidNumber: ${uuid}\n` +
        `homeDirectory: /home/${username}\n` +
        `userPassword: ${password}\n` +
        `loginShell: /bin/bash\n`;
        
        fs.writeFile(`/etc/ldap/${username}.ldif`, accountInfo, (err) => {
            if (err) {
              console.error('Error al crear el archivo:', err);
                return false;
            }
            exec(`ldapadd -c -x -D "cn=admin,dc=ldapmss245,dc=eastus,dc=cloudapp,dc=azure,dc=com" -w '${process.env.LDAP_PASSWORD}' -f /etc/ldap/${username}.ldif`, (error, stdout, stderr) => {
                if (error) {
                    console.error(
                        `Error ejecutando el comando: ${error.message}`
                    );
                    return false;
                }
                if (stderr) {
                    console.error(`Error en el comando: ${stderr}`);
                    return false;
                }
            });
          });   
         
            setCookie(username);
           
          return true;
    } catch(error) {
        console.error(error);
        return false;
    }

}

