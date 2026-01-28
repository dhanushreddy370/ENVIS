// Basic file system "database" to unblock user from IP whitelist issues
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

// Ensure directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Ensure file exists
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

export const readUsers = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

export const writeUsers = (users) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
};

export const findUserByUsername = (username) => {
    const users = readUsers();
    return users.find(u => u.username === username);
};

export const findUserById = (id) => {
    const users = readUsers();
    return users.find(u => u._id === id);
};

export const createUser = async (userObj) => {
    const users = readUsers();
    const newUser = {
        _id: Date.now().toString(), // Simple mock ID
        ...userObj,
        // Mock the Mongoose methods for compatibility
    };
    users.push(newUser);
    writeUsers(users);
    return newUser;
};

export const updateUser = (id, updates) => {
    const users = readUsers();
    const index = users.findIndex(u => u._id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        writeUsers(users);
        return users[index];
    }
    return null;
}
