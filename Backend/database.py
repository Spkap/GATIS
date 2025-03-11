import sqlite3
from contextlib import closing
import bcrypt

def get_db_connection():
    return sqlite3.connect('users.db')

def init_db():
    with closing(get_db_connection()) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                generations INTEGER DEFAULT 0
            )
        ''')
        conn.commit()

def get_user(username: str):
    conn = get_db_connection()
    user = conn.execute(
        'SELECT username, email, hashed_password, generations FROM users WHERE username = ?',
        (username,)
    ).fetchone()
    conn.close()
    
    if user:
        return {
            "username": user[0],
            "email": user[1],
            "hashed_password": user[2],
            "generations": user[3]
        }
    return None

def create_user(username: str, email: str, password: str):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    try:
        conn = get_db_connection()
        conn.execute(
            'INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)',
            (username, email, hashed_password.decode('utf-8'))
        )
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def update_generation_count(username: str):
    try:
        conn = get_db_connection()
        conn.execute(
            'UPDATE users SET generations = generations + 1 WHERE username = ?',
            (username,)
        )
        conn.commit()
        return True
    except Exception as e:
        print(f"Error updating generation count: {e}")
        return False
    finally:
        conn.close()