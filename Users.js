import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFile = path.join(__dirname, 'users.json');

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile, 'utf-8');
  return JSON.parse(data || '[]');
}
function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function createUserContainer(email){
  const username = email.slice(0, email.indexOf('@'));  
  fs.writeFile(path.join(__dirname, 'UsersContacts', `${username}.json`), '[]', (err) => {
    if(err) throw err;
  });
}
function deleteUserContainer(email){
  const username = email.slice(0, email.indexOf('@'));
  fs.unlink(path.join(__dirname, 'UsersContacts', `${username}.json`), (err) => {
    if(err) throw err;
  });
}


export async function registerUser(username, email, phone, password, secQuestion, secAnswer) {
  const isLogin = false;
  const users = readUsers();
  const user = await users.find((user) => user.email === email);
  if(user) return false;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now(),
    username,
    email,
    phone,
    password: hashedPassword,
    secQuestion,
    secAnswer,
    isLogin,
    theme: 'light'
  };
  users.push(newUser);
  writeUsers(users);
  createUserContainer(newUser.email);
  return true;
}

export async function loginUser(email, password) {
  const users = readUsers();
  const user = await users.find(user => user.email === email);
  if(!user) return false;
  const match = await bcrypt.compare(password, user.password);
  if(!match) return false;
  user.isLogin = true;
  writeUsers(users);
  return user;
}

export async function verifyUser(email, question, answer, newPassword) {
  const users = readUsers();
  const user = await users.find(user => user.email === email);
  if(!user) return false;
  if(user.secQuestion === question && user.secAnswer === answer) {
    const password = await bcrypt.hash(newPassword, 10);
    user.password = password;
    writeUsers(users);
    return true;
  } else {return false}  
}

export async function logoutUser(email) {
  const users = readUsers();
  const user = await users.find(user => user.email === email);
  if (!user) return false;
  if(!user.isLogin) return false;  
  user.isLogin = false;
  writeUsers(users);
  return true;
}

export async function deleteUser(email) {
  const user = await getUser(email);
  if(!user) return false;
  deleteUserContainer(`${user.email}`);  
  const users = readUsers();
  const activeUsers = await users.filter(user => user.email !== email);
  writeUsers(activeUsers);
  return true;
}

export async function getUser(email) {
  const users = readUsers();
  const matchedUser = await users.find(user => user.email === email);
  if(!matchedUser) return false;
  if(!matchedUser.isLogin) return false;
  return matchedUser;
}

export async function setUserTheme(email, choice) {
  const users = readUsers();
  const user = await users.find(user => user.email === email);
  if(!user) return false;
  user.theme = `${choice}`;
  writeUsers(users);
  return true;
}