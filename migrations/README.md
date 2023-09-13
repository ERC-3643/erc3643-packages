# Installing dependencies
1. In the project root directory run
```bash
git clone https://github.com/TokenySolutions/T-REX.git
```

2. Change directory to `migrations` in the project root directory and run command below
```bash
cd ./migrations && npm ci
```
3. Change directory to `T-REX` in the project root directory and run command below
```bash
cd ./T-REX && npm ci
```

# Compiling and deploying T-Rex ecosystem to local blockchain
1. In a separate terminal tab or window execute command below in the project root directory and let it run
```bash
cd ./migrations && npm run hardhat:node
```
2. In another terminal tab or window, change directory to `T-REX`  in the project root directory and run
```bash
cd ./T-REX && npx hardhat run --network localhost ../migrations/deploy.ts
```

___[Optional]___

_To run seed script. Change directory to `migrations` in the project root directory and run command below_

```bash
cd ./migrations && npm run token:ether
```

# Stopping the network
1. To stop the network you can just close the terminal session where you ran `npm run hardhat:node`
