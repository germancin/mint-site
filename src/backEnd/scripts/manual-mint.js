const { create, globSource, CID } = require('ipfs-http-client')
const ipfs = create('http://127.0.0.1:5002')
const NFT = artifacts.require("NFT")
const fs = require('fs');

/**
 * Your have to run this files twice 
 * you need to change the minting action into the env file
 * MINTING_ACTION="CreateJsonFiles"
 * MINTING_ACTION="MintJsonFiles"
 * 
 */

// !(migrate --reset) contract before running the script!

module.exports = async function (callback) {
	try {
		let nftsData = [] //NFT's database for front-end
		const nft = await NFT.deployed()
		const accounts = await web3.eth.getAccounts();
		var myArgs = process.argv.slice(2);
		const createJsonFiles = myArgs.includes('createJsonFiles');
		const mintJsonFiles = myArgs.includes('mintJsonFiles');

		/**
		 * This section you should change the ipf id of the files
		 * and it will be generate the file url.
		 */
		const ipfPath = "QmZ7nNZih6XBpbo8NEaqcTyHYDgaX6EBYgrKhhWzjgXEhy";

		console.log('\nUploading images on IPFS...')
		let files = fs.readdirSync(`${__dirname}/gallery`);
		//let upload = await ipfs.add(globSource(`${__dirname}/gallery`, { recursive: true }))

		if (createJsonFiles) {
			console.log('\nPreparing metadata directory...')
			await fs.rmdirSync(`${__dirname}/metadata`, { recursive: true }, callback);
			await fs.mkdirSync(`${__dirname}/metadata`, { recursive: true }, callback);
		}

		console.log('\nCreating metadata...');
		for (let i = 0; i < files.length; i++) {
			let imagePath = `https://ipfs.io/ipfs/${ipfPath}/${files[i]}`;
			let fileName = `${/[^.]*/.exec(files[i])[0]}`;
			let metadata = null;

			if (files[i].includes(".mp3")) {

				metadata = JSON.stringify({
					"id": `${i + 1}`,
					"name": `${fileName}`,
					"description": "Barcelona BSC - Music Media Art.",
					"mediaSource": imagePath,
					"type": "audio",
					"img": fs.readFileSync(`${__dirname}/gallery/${files[i]}`).toString('base64'),

				}, null, '\t');


			} else if (files[i].includes(".png") || files[i].includes(".jpg") || files[i].includes(".jpeg")) {

				metadata = JSON.stringify({
					"id": `${i + 1}`,
					"name": `${fileName}`,
					"description": "Barcelona BSC Images Art.",
					"mediaSource": imagePath,
					"type": "image",
					"img": fs.readFileSync(`${__dirname}/gallery/${files[i]}`, { encoding: 'base64' }),

				}, null, '\t');
			}

			nftsData.push(metadata)

			if (createJsonFiles) {
				console.log("METADA:", metadata)

				await fs.writeFileSync(`${__dirname}/metadata/${/[^.]*/.exec(files[i])[0]}.json`, metadata)

				console.log("JSON Files were created");

				// callback()
			}	
		}


		/**
		 * Here we are goin to mint the creadet token.
		 */
		if (mintJsonFiles) {
			
			console.log('\nMinting Json Files...')
			/**
			 * This section you should change the ipf id of the files
			 * and it will be generate the file url.
			 * you need to update the JSON files to pinata
			 * and paste the CID code
			 */
			const ipfPathJson = "QmYXTrrrpPTxnYycLxNTypCArBF3yw9U9y7TRwMXrR5t5H";

			console.log('\nUploading metadata on IPFS...')
			files = fs.readdirSync(`${__dirname}/metadata`);
			// upload = await ipfs.add( globSource(`${__dirname}/metadata`, { recursive: true }) )

			console.log('\nMinting NFTs...', files)
			for (let i = 0; i < files.length; i++) {
				const responseMint = await nft.mint(`https://ipfs.io/ipfs/${ipfPathJson}/${files[i]}`, web3.utils.toWei('0.001', 'Ether'))

				console.log("MINTRESPONSE::::", responseMint)

				nftsData[i] = nftsData[i].slice(0, -2) + `,\n\t"price": ${await nft.price(i + 1)},\n\t"uri": "${await nft.tokenURI(i + 1)}"\n}` //add price&URI to nftsData
				console.log(`\n${i + 1} NFT is minted with URI:\n${await nft.tokenURI(i + 1)}`)
			}

			console.log('\nAggregating NFTs data...')
			if (fs.existsSync(`${__dirname}/nftsData.js`)) {
				await fs.unlinkSync(`${__dirname}/nftsData.js`)
			}
			await fs.writeFileSync(`${__dirname}/nftsData.js`, `export const nftsData = [${nftsData}]`)

			console.log('\n\nSuccess.')

			callback()
		}

	} catch (error) {
		console.log(error)
	}
	
	
}