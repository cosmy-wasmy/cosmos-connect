# Cosmos Connect

<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=spoorthi.cosmy-wasmy">
    <img src="https://raw.githubusercontent.com/cosmy-wasmy/cosmos-connect/main/images/icon.png" alt="Cosmy Wasmy logo" title="Cosmos Connect icon" align="center" width="150" />
</a>
</p>


Comos Connect makes it easy to query Cosmos-SDK based blockchains. You can perform specific chain related queries or subscribe to various events using the websocket.

<!-- Find release notes in [CHANGELOG](CHANGELOG.md) -->

---

## Table of Contents

* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Configuration](#configuration)
* [Commands](#commands)

---

## Getting Started

This section is intended to give you an introduction to using Cosmos Connect.

### Prerequisites

* [VSCode](https://code.visualstudio.com/) to install the extension locally.

Alternatively,

* [VSCode.dev](https://vscode.dev/) to install the extension on browser editor.

---

## Installation

You can install Cosmos Connect from the [visual studio marketplace](https://marketplace.visualstudio.com/items?itemName=spoorthi.cosmos-connect) 

Or, you can search for `Cosmos Connect` in vscode Extensions sidebar. 

> **Note**
>
> The extension provides Walkthroughs for the major features. You can access the walkthroughs by going to Command Palette (Windows: `Ctrl+Shft+P`, MacOS: `Cmd+Shft+P`, Linux: `Ctrl+Shft+P`) and selecting **"Welcome: Open Walkthrough"**.

It is recommended post installation to configure the extension for your use case. Here are the first few things you might wanna do.

1. Select your target chain

    The extension is pre-configured with Cosmos Hub and localnet. You can find more details in the [Configuration](#configuration) section.

    ![Change Chain Configuration](./images/changeChain.gif)

2. Explore the settings

    Explore all the configurations available in the extension by going to `File > Preferences > Settings > Extensions > Cosmos Connect`. 

---

## Configuration

The following chains are pre-configured by default. Any other chains can be manually added in the settings.

|     | Chain                                     | REST Url                                    | Websocket Url                                  |
| --- | ----------------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| 1   | [Cosmos Hub](https://cosmos.network/)     | https://rest.lavenderfive.com:443/cosmoshub | wss://rpc.lavenderfive.com/cosmoshub/websocket |
| 2   | Localnet                                  | http://localhost:1317                       | ws://localhost:26657/websocket                 |

You can set up the extension settings at
> File > Preferences > Settings > Extensions > Cosmos Connect

| Setting | Type | Default  | Scope | Details |
| --------|------|----------|-------|---------|
| `cosmos-connect.workspaceChain` | string | Cosmos Hub | Workspace | This setting is used to select which of the given chains is to be used in this workspace |
| `cosmos-connect.chains`  | json   | *Refer above* | Application | Stores an array of JSON objects which contains the chain connection details. <br />  The structure of the expected setting is elaborated below this table  |


The structure of the expected setting for `cosmos-connect.chains`:
```json
[
    {
        "name": "Cosmos Hub", // A unique human friendly name for the chain
        "rest": "https://rest.lavenderfive.com:443/cosmoshub", // Used to perform Rest queries to fetch Tx details etc.
        "websocket": "wss://rpc.lavenderfive.com/cosmoshub/websocket", // Used to subscribe to blocks etc.
    }
]
```
---

## Commands

These commands can be activated using View > Command Palette (Windows: `Ctrl+Shft+P`, MacOS: `Cmd+Shft+P`, Linux: `Ctrl+Shft+P`) 

All the given keybindings can be customized

| Title                     | Command                               | Details | 
|---------------------------|---------------------------------------|---------| 
| Query Tx                  | cosmos-connect.queryTx                | Queries the transaction details for the given transaction hash |
| Query Node Info           | cosmos-connect.queryNodeInfo          | Queries the connected node information | 
| Query Latest Block        | cosmos-connect.queryLatestBlock       | Queries the latest block on the selected chain | 
| Query Block By Height     | cosmos-connect.queryBlockByHeight     | Queries the block details for the given block height on the selected chain |
| Query All Module Accounts | cosmos-connect.queryAllModuleAccounts | Queries all the existing module accounts on the selected chain along with their permissions |
| Query All Denoms Metadata | cosmos-connect.queryAllDenomsMetadata | Queries all the denoms on the selected chain, along with its metadata. Includes the IBC and tokenfactory denoms |
| Subscribe To New Blocks   | cosmos-connect.subscribeToNewBlock    | Subscribe to the latest blocks feed |
| Subscribe To Custom Event | cosmos-connect.subscribeToCustomEvent | Subscibe via the given websocket any custom event. Details: [CometBFT - Subscribing to events via Websocket](https://docs.cometbft.com/v0.37/core/subscription) |
