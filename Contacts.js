import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUser } from './Users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readContacts(userEmail) {
  const username = userEmail.slice(0, userEmail.indexOf('@'));
  if (!fs.existsSync(path.join(__dirname, 'UsersContacts', `${username}.json`))) return [];
  const data = fs.readFileSync(path.join(__dirname, 'UsersContacts', `${username}.json`), 'utf-8');
  return JSON.parse(data || '[]');
}

function writeContacts(userEmail, contacts) {
  const username = userEmail.slice(0, userEmail.indexOf('@'));
  fs.writeFileSync(path.join(__dirname, 'UsersContacts', `${username}.json`), JSON.stringify(contacts, null, 2));
}

// Get contacts
export async function getContacts(userEmail) {
  const user = await getUser(userEmail);
  if(!user) return false;
  const contacts = readContacts(userEmail);
  return contacts; 
}
export async function getFavContacts(userEmail) {
  const user = await getUser(userEmail);
  if(!user) return false;
  const contacts = readContacts(userEmail);
  const favContacts = contacts.filter(contact => contact.isFav === true);
  return favContacts;
}

// Find a specific contact
export async function findContact(userEmail, id) {
  const user = await getUser(userEmail);
  if(!user) return false;
  const contacts = readContacts(userEmail);
  const numId = Number(id);
  const contact = contacts.find(contact => contact.id === numId);
  if(!contact) return false;
  return contact;
}

// Add a contact
export async function addContact(userEmail, name, phone, isFav) {
  const user = await getUser(userEmail);
  if(!user) false;
  const contacts = readContacts(userEmail);
  const contact = contacts.find(contact => contact.phone === phone);
  if(contact) return false;
  const newContact = {
    id: Date.now(),
    name,
    phone,
    isFav
  };
  contacts.push(newContact);
  writeContacts(userEmail, contacts);
  return true;
}

// Delete a contact
export async function deleteContact(userEmail, id) {
  const user = await getUser(userEmail);
  if(!user) return false;
  const contacts = readContacts(userEmail);
  const numId = Number(id);
  const contact = contacts.filter(contact => contact.id !== numId)
  writeContacts(userEmail, contact);
  return true;
}

// Update a contact
export async function updateContact(userEmail, id, name, phone, isFav) {
  const user = await getUser(userEmail);
  if(!user) return false;
  const contacts = readContacts(userEmail);
  const numId = Number(id);
  const existContacts = contacts.filter(contact => contact.id !== numId);
  const existContact = existContacts.find(contact => contact.phone === phone);
  const contact = contacts.find(contact => contact.id === numId);
  if (!contact || existContact) return false;
  contact.name = name;
  contact.phone = phone;
  contact.isFav = isFav;
  writeContacts(userEmail, contacts);
  return true;
}

// toggle favorite
export async function toggleFavorite(userEmail, id, isFav) {
  const user = await getUser(userEmail);
  if(!user) return false;
  const contacts = readContacts(userEmail);
  const numId = Number(id);
  const contact = contacts.find(contact => contact.id === numId);
  if(!contact) return false;
  contact.isFav = isFav;
  writeContacts(userEmail, contacts);
  return true;
}

// Search Contact
export async function searchContact(userEmail, name){
  const dname = name.toLowerCase();
  const user = await getUser(userEmail);
  if(!user) return false;
  const contacts = readContacts(userEmail);
  const matchedContacts = contacts.filter(contact => contact.name.toLowerCase().includes(`${dname}`));
  if(!matchedContacts) return false;
  return matchedContacts;
}

