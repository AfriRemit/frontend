
import { claimTo, getNFT, getOwnedNFTs } from "thirdweb/extensions/erc1155";
import {
	ConnectButton,
	MediaRenderer,
	TransactionButton,
	useActiveAccount,
	useReadContract,
} from "thirdweb/react";

import {accountAbstraction,
	client
	} from '../lib/consts';


const GaslessHome = () => {
	
	return (
		<div className="flex flex-col items-center">
			<h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-12 text-zinc-100">
				Sponsored Transactions
			</h1>
			<ConnectButton
				client={client}
				accountAbstraction={accountAbstraction}
				connectModal={{
					size: "compact",
				}}
			/>
			
			<a href={"/"} className="text-sm text-gray-400 mt-8">
				Back to menu
			</a>
		</div>
	);
};

export default GaslessHome;