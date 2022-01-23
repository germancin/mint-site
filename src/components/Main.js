import ReactTypingEffect from 'react-typing-effect';
import { buyNft } from '../store/interactions'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Identicon from 'identicon.js';
import Loading from './Loading'
import {
	contractSelector,
	metadataSelector,
	nftStateSelector,
	networkSelector,
	metadataLoadedSelector,
	nftStateLoadedSelector
} from '../store/selectors'

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

class Main extends Component {
	render() {
		const soundImgPath = "https://gateway.pinata.cloud/ipfs/QmdWJhWwRNgerjGWmtKoaJutVXCJKqBNDCLxaMUULQ3pfd?preview=1";
		if (this.props.dataLoaded) {
			return (
				<div className="Main">
					<div className="container-fluid mt-5" style={{ color: "#55FF55", "backgroundColor": "#1D1D1D" }}>

						<br></br>
						<div>
							<ReactTypingEffect
								text={[
									"Welcome to NFT Cyclopee",
									"Presented by GcomLnk 🎓",
									"Look around and choose the NFT you like",
									'Click "Buy" to get UNIQUE 💎 NFT',
									"Hurry up before all NFTs are sold out!"
								]}
								speed='40'
								eraseSpeed='10'
								eraseDelay='2000'
								cursorRenderer={cursor => <h1>{cursor}</h1>}
								displayTextRenderer={(text, i) => {
									return (
										<h1>
											{text.split('').map((char, i) => {
												const key = `${i}`;
												return (
													<span
														key={key}
														style={i % 2 === 0 ? {} : {}}
													>{char}</span>
												);
											})}
										</h1>
									);
								}}
							/>
						</div>
						<br></br>&nbsp;

						{/* Header Main image */}
						<img src={'https://i.gyazo.com/ed6df2ee521e82ae2498da1af3454c52.png'} style={{ width: '1000px', height: '300px' }} alt="adam" />


						<div className="row">
							<main role="main" className="col-lg-12 d-flex text-center">
								<div className="content mr-auto ml-auto">
									<div className="row justify-content-around" style={{ width: '1000px', fontSize: '13px' }}>

										{
											(this.props.metadata)?
												this.props.metadata.map((nft, key) => {
													console.log("type:::::::", nft)
													return (

														(nft.type === "audio") ?
															<div className="p-3" key={key}>
																<table style={{ width: '200px', border:"0px solid yellow" }} >
																	<tbody>
																		<tr>
																			<td colSpan="2">
																				<a href={nft.image} target="_blank" rel="noreferrer">
																					<img src={`${soundImgPath}`} style={{
																						border: '1mm ridge #55FF55',
																						width: '100%',
																						height: '219px',
																					}} alt="artId" />
																				</a>
																			</td>
																		</tr>
																		<tr style={{paddingLeft:"10px"}}>
																			<th className="tableText" style={{ color: "#8B8B8B" }}>ID: </th>
																			<th style={{ color: "#FFFFFF" }}>{nft.id}</th>
																		</tr>
																		<tr>
																			<th className="tableText" style={{ color: "#8B8B8B" }}>URI: </th>
																			<td>
																				<a href={nft.uri} target="_blank" rel="noopener noreferrer" style={{ color: "#55FF55" }}>
																					Contract
																				</a>
																			</td>
																		</tr>
																		{this.props.nftState[nft.id]
																			? <tr>
																				<th className="tableText" style={{ color: "#8B8B8B" }}>Owner:</th>
																				<th>
																					<img
																						alt="NFT_ID"
																						className="ml-2 id border border-success"
																						width="15"
																						height="15"
																						src={`data:image/png;base64,${new Identicon(this.props.nftState[nft.id], 30).toString()}`}
																					/>{' '}
																					<a
																						href={`https://etherscan.io/address/` + this.props.nftState[nft.id]}
																						target="_blank"
																						rel="noopener noreferrer"
																						style={{ color: "#55FF55", "fontWeight": "normal" }}
																					>
																						{this.props.nftState[nft.id].substring(0, 8) + '...'}
																					</a>
																				</th>
																			</tr>
																			: <tr>
																				<th className="tableText" style={{ color: "#8B8B8B" }}>Price: </th>
																				<th style={{ color: "#FFFFFF" }}>{nft.price / 10 ** 18} ETH</th>
																			</tr>	
																		}
																		<tr>
																			<th colSpan="2">
																				<AudioPlayer
																					src={nft.image}
																					onPlay={e => console.log("onPlay")}
																					sx={{ border: "2px solid black" }}
																				// other props here
																				/>
																			</th>
																		</tr>
																		<tr>
																			<th colSpan="2">
																				
																				{
																					this.props.nftState[nft.id]
																						? <button
																							type="Success"
																							className="btn btn-block btnBuy"
																							style={{ border: '1px ridge #8B8B8B', color: "#8B8B8B", width: '100%' }}
																							onClick={(e) => buyNft(this.props.dispatch, nft.id, nft.price)}
																							disabled
																						>
																							<b>S o l d</b>
																						</button>
																						: <button
																							type="Success"
																							className="btn btn-block btn-outline btnBuy"
																							style={{ border: '1px ridge #55FF55', color: "#55FF55", width: '100%' }}
																							onClick={(e) => buyNft(this.props.dispatch, nft.id, nft.price)}
																						>
																							<b>B u y</b>
																						</button>
																				}


																			</th>
																		</tr>
																	</tbody>
																</table>
																
															</div>
															: <div className="p-3" key={key}>
															
																<table style={{ width: '200px' }}>
																	<tbody>
																		<tr>
																			<th colSpan="2">
																				{this.props.nftState[nft.id]
																					?
																					<a href={nft.image} target="_blank" rel="noopener noreferrer">
																						<img src={`data:image/png;base64,${nft.img}`} style={{ border: '1mm ridge #8B8B8B', width: '100%', height: 'auto' }} alt="artId" />
																					</a>

																					:
																					<a href={nft.image} target="_blank" rel="noopener noreferrer">
																						<img src={`data:image/png;base64,${nft.img}`} style={{ border: '1mm ridge #55FF55', width: '100%', height: 'auto' }} alt="artNoId" />
																					</a>
																				}
																			</th>
																		</tr>
																		<tr>
																			<th className="tableText" style={{ color: "#8B8B8B" }}>ID: </th>
																			<th style={{ color: "#FFFFFF" }}>{nft.id}</th>
																		</tr>
																		<tr>
																			<th className="tableText" style={{ color: "#8B8B8B" }}>URI: </th>
																			<td>
																				<a href={nft.uri} target="_blank" rel="noopener noreferrer" style={{ color: "#55FF55" }}>
																					Contract
																				</a>
																			</td>
																		</tr>
																		{this.props.nftState[nft.id]
																			? <tr>
																				<th className="tableText" style={{ color: "#8B8B8B" }}>Owner:</th>
																				<th>
																					<img
																						alt="NFT_ID"
																						className="ml-2 id border border-success"
																						width="15"
																						height="15"
																						src={`data:image/png;base64,${new Identicon(this.props.nftState[nft.id], 30).toString()}`}
																					/>{' '}
																					<a
																						href={`https://etherscan.io/address/` + this.props.nftState[nft.id]}
																						target="_blank"
																						rel="noopener noreferrer"
																						style={{ color: "#55FF55", "fontWeight": "normal" }}
																					>
																						{this.props.nftState[nft.id].substring(0, 8) + '...'}
																					</a>
																				</th>
																			</tr>
																			: <tr>
																				<th className="tableText" style={{ color: "#8B8B8B" }}>Price: </th>
																				<th style={{ color: "#FFFFFF" }}>{nft.price / 10 ** 18} ETH</th>
																			</tr>
																		}

																		<tr>
																			<th colSpan="2">

																				{
																					this.props.nftState[nft.id]
																						? <button
																							type="Success"
																							className="btn btn-block btnBuy"
																							style={{ border: '1px ridge #8B8B8B', color: "#8B8B8B", width: '100%' }}
																							onClick={(e) => buyNft(this.props.dispatch, nft.id, nft.price)}
																							disabled
																						>
																							<b>S o l d</b>
																						</button>
																						: <button
																							type="Success"
																							className="btn btn-block btn-outline btnBuy"
																							style={{ border: '1px ridge #55FF55', color: "#55FF55", width: '100%' }}
																							onClick={(e) => buyNft(this.props.dispatch, nft.id, nft.price)}
																						>
																							<b>B u y</b>
																						</button>
																				}


																			</th>
																		</tr>
																	</tbody>
																</table><p></p>
																
															</div>
													)
												}) : null
											}
												

									</div>
								</div>
							</main>
						</div>
					</div>
					<br></br>
					<footer>
						{this.props.contract
							? <div style={{ color: "#8B8B8B", fontSize: "14px" }}>
								NFT deployed at:&nbsp;
								<a
									href={`https://${this.props.network}.etherscan.io/address/` + this.props.contract._address}
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: "#55FF55" }}
								>
									{this.props.contract._address}
								</a>
							</div>
							: <div> Wrong network </div>
						}
					</footer>
					{
						console.log("THE PORPS:::::", this.props)
					}
				</div>
			)
		} else {
			return (
				<Loading />
			)
		}
	}
}

function mapStateToProps(state) {
	const dataLoaded = metadataLoadedSelector(state) && nftStateLoadedSelector(state)

	return {
		metadata: metadataSelector(state),
		contract: contractSelector(state),
		nftState: nftStateSelector(state),
		network: networkSelector(state),
		dataLoaded
	}
}

export default connect(mapStateToProps)(Main)