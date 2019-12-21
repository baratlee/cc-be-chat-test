run `node index.js` in terminal to run the chat client

Operating environment Linux or MacOS

### --start chat server--
node server.js

### --start chat client--
node index.js  
node index.js  
...

### --unit test--
npm test   
./node_modules/.bin/ava  

### ====System design decisions====
I haven't used javascript or nodejs before.  
There may be a lot of text in the chat, and the efficiency of Profanity Filter needs to be considered.   
The keyword list is loaded asynchronously to avoid clogging the system.  
Entering a name is considered a login operation, and no one else can chat until then.   
Since there is no certification process. The name is the key that identifies the user.   
If the same name is used, it is considered the same person.  
In order to prevent the client from impersonating others, the speaker's name is filled in by the server.  
The client is considered to be one-off and does not support short-term reconnection. Reconnection can only be achieved by restarting the program.  
  
### ====Optimization/Efficiency====
Due to the lack of research on the scheduling mechanism of nodejs, the use of processes has not been optimized.   
The main optimization is to improve the efficiency of Profanity Filter, using a typical Trie, and implementing a simple tree structure by itself.  

### ====Scaling Concerns====
Since each function has many possibilities for expansion, try to use smaller modules as many as possible.   
The parts of time that have not been modularized are also implemented using the smallest possible functions. Small functions can improve the reusability of the code and also facilitate testing.  
Chat history as a separate class can extend more complex query capabilities.  
Trie can support massive keyword lists and massive inspection content.  

### ====List of all NPM packages added and why====
1. Ava. Used for unit testing, because it is unfamiliar with its functions, it fails to cover all test cases, but  makes a sample to demonstrate its availability simply.  
2. ws. websocket library.  
3. leveldb. No installation, but I still need to explain.   
   I spent several hours trying to add it to the function, but there is a small problem and I decided to give up.   
   This kv storage is very suitable for real-time communication software.  
