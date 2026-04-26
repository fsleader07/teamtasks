CREATE TABLE IF NOT EXISTS public.tb_tasks (
    id SERIAL PRIMARY KEY,                    
    project VARCHAR(100),                     
    task_name TEXT NOT NULL,                  
    description TEXT,                         
    assignee INTEGER[],                       
    status VARCHAR(50) DEFAULT 'Pending',     
    priority VARCHAR(20) DEFAULT 'Normal',    
    author VARCHAR(100),                      
    deadline DATE,                            
    completed_at DATE,                        
    note TEXT,                                
    created_at TIMESTAMPTZ DEFAULT NOW()      
);

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_personel (
    person_id SERIAL PRIMARY KEY,
    firstname VARCHAR(150) NOT NULL,
	lastname VARCHAR(150) NOT NULL,
    nickname VARCHAR(100),
    email VARCHAR(150),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_users (
    user_id SERIAL PRIMARY KEY,
    person_id INT UNIQUE,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);