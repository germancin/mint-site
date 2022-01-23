const { create, globSource } = require('ipfs-http-client')
const ipfs = create('http://127.0.0.1:5002')
const NFT = artifacts.require("NFT")
const fs = require('fs');

// !(migrate --reset) contract before running the script!

module.exports = async function (callback) {
	try {
		let nftsData = [] //NFT's database for front-end
		const nft = await NFT.deployed()
		const accounts = await web3.eth.getAccounts()

		console.log('\nUploading images on IPFS...')
		let files = fs.readdirSync(`${__dirname}/gallery`);
		let upload = await ipfs.add(globSource(`${__dirname}/gallery`, { recursive: true }))

		console.log('\nPreparing metadata directory...')
		await fs.rmdirSync(`${__dirname}/metadata`, { recursive: true }, callback);
		await fs.mkdirSync(`${__dirname}/metadata`, { recursive: true }, callback);

		console.log('\nCreating metadata...');
		for (let i = 0; i < files.length; i++) {
			let imagePath = `https://ipfs.io/ipfs/${upload.cid.toString()}/${files[i]}`;
			let fileName = `${/[^.]*/.exec(files[i])[0]}`;
			let metadata = null;

			console.log("CHECK IMAGE PATH", imagePath)

			if (files[i].includes(".mp3")) {

				metadata = JSON.stringify({
					"id": `${i + 1}`,
					"name": `${imagePath}`,
					"description": "Barcelona BSC - Music Media Art.",
					"image": imagePath,
					"type": "audio",
					"img": imagePath,
					
				}, null, '\t');


			} else if (files[i].includes(".png") || files[i].includes(".jpg") || files[i].includes(".jpeg")) {

				metadata = JSON.stringify({
					"id": `${i + 1}`,
					"name": `${fileName}`,
					"description": "Barcelona BSC Images Art.",
					"image": imagePath,
					"type": "image",
					"img": fs.readFileSync(`${__dirname}/gallery/${files[i]}`, { encoding: 'base64' }),

				}, null, '\t');
			}

			nftsData.push(metadata)

			// nftsData.push(metadata.slice(0, -2) + `,\n\t"id": ${i+1}\n}`) //add metadata&id to nftsData
			await fs.writeFileSync(`${__dirname}/metadata/${/[^.]*/.exec(files[i])[0]}.json`, metadata)
		}

		console.log('\nUploading metadata on IPFS...')
		files = fs.readdirSync(`${__dirname}/metadata`);
		upload = await ipfs.add(globSource(`${__dirname}/metadata`, { recursive: true }))

		console.log('\nMinting NFTs...')
		for (let i = 0; i < files.length; i++) {

			// sea acaba de subir los metadata files los json files.
			// aqui basicamente se hace contratao a ese file json 001-intro.json 
			// adentro de este file tiene las diereciones de los assets.
			await nft.mint(`https://ipfs.io/ipfs/${upload.cid.toString()}/${files[i]}`, web3.utils.toWei('0.001', 'Ether'))


			// aqui ya lo llena con la uri el lugar donde lo acaba de subir al ipfs 
			// este es el contrato del nft y se puede ver el contrato unmber en el momento que 
			// se corre maint.js (this file)
			nftsData[i] = nftsData[i].slice(0, -2) + `,\n\t"price": ${await nft.price(i + 1)},\n\t"uri": "${await nft.tokenURI(i + 1)}"\n}` //add price&URI to nftsData
			console.log(`\n${i + 1} NFT is minted with URI:\n${await nft.tokenURI(i + 1)}`)
		}

		console.log('\nAggregating NFTs data...')
		if (fs.existsSync(`${__dirname}/nftsData.js`)) {
			await fs.unlinkSync(`${__dirname}/nftsData.js`)
		}
		await fs.writeFileSync(`${__dirname}/nftsData.js`, `export const nftsData = [${nftsData}]`)

		console.log('\n\nSuccess.')
	} catch (error) {
		console.log(error)
	}
	callback()
}