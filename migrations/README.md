# First, you need to install all dependencies
1. In the project root run `git clone https://github.com/TokenySolutions/T-REX.git` 
1. Change directory to `root/migrations` and run `npm ci`
1. Change directory to `root/T-REX` and run `npm ci`

# Compiling and deploying T-Rex ecosystem to local blockchain
1. In a separate terminal tab or window, change directory to `root/migrations` and run `npm run hardhat:node` and let it run
1. In another terminal tab or window, change directory to `root/T-REX` and run `npx hardhat run --network localhost ../migrations/deploy.ts`

# Stopping the network
1. To stop the network you can just close the terminal session where you ran `npm run hardhat:node`
