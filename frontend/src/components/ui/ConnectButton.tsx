// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { FC } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from '@/config/cartesi.json'
import Button from "../shared/Button";

const config: any = configFile;

const ConnectButton: FC = () => {
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
    const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();
console.log('heeee')
    return (
        <div>
      {!wallet && (
        <Button onClick={() => connect()} className="w-[200px]">
          {connecting ? 'Connecting ...' : 'Connect'}
        </Button>
      )}

      {wallet && (
        <div className="space-x-3">
  
          <Button onClick={() => disconnect(wallet)} className="w-[200px]">
            Disconnect Wallet
          </Button>
        </div>
      )}
    </div>
        // <div>
        //     {!wallet && <button
        //         onClick={() =>
        //             connect()
        //         }
        //     >
        //         {connecting ? "connecting" : "connect"}
        //     </button>}
        //     {wallet && (
        //         <div>
        //             <label>Switch Chain</label>
        //             {settingChain ? (
        //                 <span>Switching chain...</span>
        //             ) : (
        //                 <select
        //                     onChange={({ target: { value } }) => {
        //                         if (config[value] !== undefined) {
        //                             setChain({ chainId: value })
        //                         } else {
        //                             alert("No deploy on this chain")
        //                         }
        //                         }
        //                     }
        //                     value={connectedChain?.id}
        //                 >
        //                     {chains.map(({ id, label }) => {
        //                         return (
        //                             <option key={id} value={id}>
        //                                 {label}
        //                             </option>
        //                         );
        //                     })}
        //                 </select>
        //             )}
        //             <button onClick={() => disconnect(wallet)}>
        //                 Disconnect Wallet
        //             </button>
        //         </div>
        //     )}
        // </div>
    );
};

export default ConnectButton;