import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { registerUser, loginUser, logoutUser, getUser, deleteUser, setUserTheme, verifyUser } from './Users.js';
import { getContacts, getFavContacts, addContact, deleteContact, updateContact, toggleFavorite, findContact, searchContact } from './Contacts.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Router for User Login and Registration 
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});
router.get('/login', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
router.get('/reset-password', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', 'resetpass.html'));
});
router.get('/home', async (req, res) => {
    const email = req.query.email;    
    const url = path.join(__dirname, 'views', 'home.html');
    if(!email) return res.sendFile(path.join(__dirname, 'views', 'login.html'));
    res.sendFile(url);
});
router.get('/home/user', async (req, res) => {
    const email = req.query.email;
    const user = await getUser(email);
    if(!user) return res.status(404).json({ message: 'User not found. Please Log in'});
    res.status(200).json({...user});
});
router.post('/home/user', async (req, res) => {
    const {email, theme} = req.body;
    const user = await setUserTheme(email, theme);
    if(!user) return res.status(404).json({ message: 'User not found. Please Log in'});
    res.status(200).json({message: 'Theme set'});
});

// POST requests
router.post('/register', async (req, res) => {
    try {
        const { newUsername, newUserEmail, newUserPhoneNo, newUserPassword, newUserSecQuestion, newUserSecAnswer } = req.body;
        const newUser = await registerUser(newUsername, newUserEmail, newUserPhoneNo, newUserPassword, newUserSecQuestion, newUserSecAnswer);
        if (!newUser) return res.status(404).json({message: 'Email already exists'});
        res.status(201).json({ message: 'Registration Successful. Please Login.' });
    } catch (err) {
        if (err) throw new Error(err);
        return res.status(500).json({err});
    }    
});
router.post('/login', async (req, res) => {
    try{
        const { userEmail, userPassword } = req.body;
        const user = await loginUser(userEmail, userPassword);
        if(!user) return res.status(404).json({ message: 'Invalid credentials' });
        res.status(200).json({ ...user, message: 'Logged in successfully' });        
    } catch (err) {
        if (err) throw new Error(err);
        return res.status(500).json({err});
    }    
});
router.post('/reset-password', async (req, res) => {
    try{
        const { userEmail, userSecQuestion, userSecAnswer, newPassword } = req.body;
        const user = await verifyUser(userEmail, userSecQuestion, userSecAnswer, newPassword);
        if(!user) return res.status(404).json({ message: `Incorrect Information` });
        res.status(200).json({ message: `Password reset successful. You can now login` });        
    } catch (err) {
        if (err) throw new Error(err);
        return res.status(500).json({err});
    }    
});
router.post('/logout', async (req, res) => {
    try{
        const { email } = req.body;
        const user = await logoutUser(email);
        if(!user) return res.status(404).json({ message: 'Not successful' });
        res.status(200).json({message : 'Logged out successfully' });
    } catch (err) {
        if (err) throw new Error(err);
        return res.status(500).json({err});
    } 
})
router.delete('/login', async (req, res) => {
    try{ 
        const { email } = req.body;
        const user = await deleteUser(email);
        if(!user) return res.status(404).json({ message : 'Not successfull' });
        res.status(200).json({ message : 'Account Deleted' });
    } catch (err) {
        if (err) throw new Error(err);
        return res.status(500).json({err});
    }
})

// Router for Contacts Management

// GET Requests
router.get('/contacts', async (req, res) => {
    try{
        const contacts = await getContacts(req.query.email);
        if(!contacts) return res.status(404).json({ message: `Please login` });
        res.status(200).json({ contacts });
    } catch (err) {
        if (err) throw new Error(err);
        return res.status(500).json({err});
    }
});
router.get('/contacts/fav', async (req, res) => {
    try{
        const contacts = await getFavContacts(req.query.email);
        if(!contacts) return res.status(404).json({ message: `Please login` });
        res.status(200).json({ contacts });
    } catch (err) {
        if (err) throw new Error(err);
        return res.status(500).json({err});
    }
});
router.get('/contacts/edit', async (req, res) => {
    try{
        const { email, id } = req.query;
        const contact = await findContact(email, id);
        if(!contact) return res.status(404).json({ message: `Contact does not exist`});
        res.status(200).json({ contact });
    } catch (err) {
        if (err) throw new Error(err);
        return res.status(500).json({err});
    }
});

// POST Requests
router.post('/contacts', async (req, res) => {
    try{
        const { email, name, phone, isFav } = req.body;
        const contact = await addContact(email, name, phone, isFav);
        if(!contact) return res.status(404).json({ message: `Phone number already exist`});
        res.status(201).json({message: 'Contact Added'});
    } catch (err) {
        if (err) throw new Error(err);
        return res.status(500).json({err});
    }
});

// DELETE Requests
router.delete('/contacts', async (req, res) => {
    try{
        const { email, id } = req.body;
        const contacts = await deleteContact(email, id);
        if(!contacts) return res.status(404).json({message: `Please login`});
        res.status(200).json({message: 'Contact Deleted'});
    } catch (err) {
        if (err) throw new Error(err);
        return res.status(500).json({err});
    }
});

//PUT Requests
router.put('/contacts', async (req, res) => {
    try{
        const { email, id, name, phone, isFav } = req.body;
        const updatedContact = await updateContact(email, id, name, phone, isFav);
        if(!updatedContact) return res.status(404).json({ message: `Phone number already exist`});
        res.status(200).json({message: 'Contact Updated'});
    } catch (err) {
        if (err) throw new Error(err);
        return res.status(500).json({err});
    }
});
router.put('/contacts/favorite', async (req, res) => {
    try{
        const { email, id, isFav } = req.body;
        const contact = await toggleFavorite(email, id, isFav);
        if (!contact) return res.status(404).json({ message: `Contact not found` });
        const mess = isFav ? 'Added to favorite' : 'Removed from favorite';
        res.status(200).json({message: mess});
    } catch (err) {
        if (err) throw new Error(err);
        return res.status(500).json({err});
    }
    
});

// Router to handle search
router.get('/contacts/search', async (req, res) => {
    try{
        const {email, name} = req.query;
        const contacts = await searchContact(email, name);
        if(!contacts) return res.status(404).json({message: `Not contact found`});
        res.status(200).json({ contacts });
    } catch (err) {
        if (err) throw new Error(err);
        return res.status(500).json({err});
    }
})

export default router;