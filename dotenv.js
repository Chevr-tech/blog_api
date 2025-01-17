const fs = require('fs');
const path = require('path');

const dotenv = {};
dotenv.config = () => {
    let dotenvPath = path.resolve(process.cwd(), '.env'), data;
    try {        
        data = fs.readFileSync(dotenvPath, 'utf8');
    }
    catch (err) {
        return 'Could\'t load .env file.';
    }
    importEnv(data);
    return 'Found .env file. OK';
}

const importEnv = data => {
    data.split('\n').forEach(variable => {
        let keyVal = variable.trim().split('=');
        let value;
        value = keyVal[1]
        process.env[keyVal[0]] = value;
    });
}

module.exports = dotenv;
