import { Logger } from "ethers/lib/utils"
import { JsonFragment } from "@ethersproject/abi"

import OpenEthereumClient from "../OpenEthereumClient"
import { MessageType, Trace } from "../transaction"
import { bytes } from "../utils/regEx"
import { EthersMatchers } from "../utils/jest"

jest.setTimeout(60000) // timeout for each test in milliseconds
// Extend the Jest matchers with Ethers BigNumber matchers like toEqualBN
expect.extend(EthersMatchers)

Logger.setLogLevel(Logger.levels.DEBUG)

const stringTokenABI: JsonFragment[] = [
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
]
// Deep copy string output ABI and change to bytes32 ABI
const bytes32TokenABI = JSON.parse(JSON.stringify(stringTokenABI))
bytes32TokenABI[0].outputs[0].type = "bytes32"
bytes32TokenABI[1].outputs[0].type = "bytes32"

const dai = "0x6b175474e89094c44da98b954eedeac495271d0f"
const uniswap = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
const maker = "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"
const usdcProxy = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
const usdcImpl = "0xb7277a6e95992041568d9391d09d0122023778a2"
const mStableUSDProxy = "0xe2f2a5C287993345a840Db3B0845fbC70f5935a5"
const mStableUSDImpl = "0xE0d0D052d5B1082E52C6b8422Acd23415c3DF1c4"
const externallyOwnerAccount = "0xbbabad191e7802f526c289c15909a8cba2a5ff2a"

describe("OpenEthereum", () => {
    const nodeClient = new OpenEthereumClient(process.env.ARCHIVE_NODE_URL)
    describe("Get transaction trace", () => {
        test("delegatecall", async () => {
            const traces = await nodeClient.getTransactionTrace(
                "0xe5e35ee13bb6326df4da89f17504a81923299d4986de06a019ca7856cbe76bca"
            )
            expect(traces).toHaveLength(5)
            expect(traces[0].id).toEqual(0)
            expect(traces[0].type).toEqual(MessageType.Call)
            expect(traces[0].from).toEqual(
                "0x7a39608107dc014d4bbd7a5f01d3fba5dff6d042"
            )
            expect(traces[0].delegatedFrom).toEqual(
                "0x7a39608107dc014d4bbd7a5f01d3fba5dff6d042"
            )
            expect(traces[0].to).toEqual(
                "0x2c4bd064b998838076fa341a83d007fc2fa50957"
            )
            expect(traces[0].inputs).toEqual(
                "0xf88bf15a000000000000000000000000000000000000000000000003d4779d242309efef000000000000000000000000000000000000000000000003b490f2f5ad3251a00000000000000000000000000000000000000000000000018b6cf07bc6019af6000000000000000000000000000000000000000000000000000000005e544375"
            )
            expect(traces[0].funcSelector).toEqual("0xf88bf15a")
            expect(traces[0].gasLimit).toEqualBN(61225)
            expect(traces[0].gasUsed).toEqualBN(52865)
            expect(traces[0].parentTrace).toBeUndefined()
            expect(traces[0].childTraces).toHaveLength(1)
            expect(traces[0].childTraces[0].id).toEqual(1)
            expect(traces[0].value).toEqualBN(0)
            expect(traces[0].address).toBeUndefined()
            expect(traces[0].refundAddress).toBeUndefined()
            expect(traces[0].balance).toBeUndefined()
            expect(traces[0].constructorParams).toBeUndefined()

            expect(traces[1].id).toEqual(1)
            expect(traces[1].type).toEqual(MessageType.DelegateCall)
            expect(traces[1].from).toEqual(
                "0x2c4bd064b998838076fa341a83d007fc2fa50957"
            )
            expect(traces[1].delegatedFrom).toEqual(
                "0x2c4bd064b998838076fa341a83d007fc2fa50957"
            )
            expect(traces[1].to).toEqual(
                "0x2157a7894439191e520825fe9399ab8655e0f708"
            )
            expect(traces[1].inputs).toEqual(
                "0xf88bf15a000000000000000000000000000000000000000000000003d4779d242309efef000000000000000000000000000000000000000000000003b490f2f5ad3251a00000000000000000000000000000000000000000000000018b6cf07bc6019af6000000000000000000000000000000000000000000000000000000005e544375"
            )
            expect(traces[1].outputs).toEqual(
                "0x000000000000000000000000000000000000000000000003c7ecb939625d2445000000000000000000000000000000000000000000000001937ed60b5c553adb"
            )
            expect(traces[1].parentTrace.id).toEqual(0)
            expect(traces[1].childTraces).toHaveLength(3)
            expect(traces[1].childTraces[0].id).toEqual(2)
            expect(traces[1].childTraces[1].id).toEqual(3)
            expect(traces[1].childTraces[2].id).toEqual(4)

            expect(traces[2].id).toEqual(2)
            expect(traces[2].from).toEqual(
                "0x2c4bd064b998838076fa341a83d007fc2fa50957"
            )
            expect(traces[2].delegatedFrom).toEqual(
                "0x2157a7894439191e520825fe9399ab8655e0f708"
            )
            expect(traces[2].to).toEqual(
                "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"
            )
            expect(traces[2].type).toEqual(MessageType.StaticCall)
            expect(traces[2].parentTrace.id).toEqual(1)

            expect(traces[3].type).toEqual(MessageType.Call)
            expect(traces[3].from).toEqual(
                "0x2c4bd064b998838076fa341a83d007fc2fa50957"
            )
            expect(traces[3].delegatedFrom).toEqual(
                "0x2157a7894439191e520825fe9399ab8655e0f708"
            )
            expect(traces[3].to).toEqual(
                "0x7a39608107dc014d4bbd7a5f01d3fba5dff6d042"
            )
            expect(traces[3].value).toEqualBN("69746325185294574661")

            expect(traces[4].type).toEqual(MessageType.Call)
            expect(traces[4].parentTrace.id).toEqual(1)
        })
        describe("mStable USD swap", () => {
            let traces: Trace[]
            beforeAll(async () => {
                traces = await nodeClient.getTransactionTrace(
                    "0xb2b0e7b286e83255928f81713ff416e6b8d0854706366b6a9ace46a88095f024"
                )
            })
            test("First trace", () => {
                expect(traces).toHaveLength(19)

                const traceIndex = 0
                expect(traces[traceIndex].id).toEqual(traceIndex)
                expect(traces[traceIndex].type).toEqual(MessageType.Call)
                expect(traces[traceIndex].from).toEqual(
                    "0x30bacd12a889c9be7e5da52aa089744c62aff878"
                )
                expect(traces[traceIndex].to).toEqual(
                    "0xe2f2a5c287993345a840db3b0845fbc70f5935a5"
                )
                expect(traces[traceIndex].funcSelector).toEqual("0x6e81221c")
                expect(traces[traceIndex].parentTrace).toBeUndefined()
                expect(traces[traceIndex].childTraces).toHaveLength(1)
                expect(traces[traceIndex].childTraces[0].id).toEqual(1)
            })
            test("Second trace", () => {
                const traceIndex = 1
                expect(traces[traceIndex].id).toEqual(traceIndex)
                expect(traces[traceIndex].type).toEqual(
                    MessageType.DelegateCall
                )
                expect(traces[traceIndex].from).toEqual(
                    "0xe2f2a5c287993345a840db3b0845fbc70f5935a5"
                )
                expect(traces[traceIndex].to).toEqual(
                    "0xe0d0d052d5b1082e52c6b8422acd23415c3df1c4"
                )
                expect(traces[traceIndex].funcSelector).toEqual("0x6e81221c")
                expect(traces[traceIndex].parentTrace?.id).toEqual(0)
                expect(traces[traceIndex].childTraces).toHaveLength(9)
                expect(traces[traceIndex].childTraces[0].id).toEqual(2)
            })
            test("Third trace", () => {
                const traceIndex = 2
                expect(traces[traceIndex].id).toEqual(traceIndex)
                expect(traces[traceIndex].type).toEqual(MessageType.StaticCall)
                expect(traces[traceIndex].from).toEqual(
                    "0xe2f2a5c287993345a840db3b0845fbc70f5935a5"
                )
                expect(traces[traceIndex].to).toEqual(
                    "0x66126b4aa2a1c07536ef8e5e8bd4efda1fdea96d"
                )
                expect(traces[traceIndex].funcSelector).toEqual("0x2bf596cf")
                expect(traces[traceIndex].parentTrace?.id).toEqual(1)
                expect(traces[traceIndex].childTraces).toHaveLength(1)
                expect(traces[traceIndex].childTraces[0].id).toEqual(3)
            })
            test("Fourth trace", () => {
                const traceIndex = 3
                expect(traces[traceIndex].id).toEqual(traceIndex)
                expect(traces[traceIndex].type).toEqual(
                    MessageType.DelegateCall
                )
                expect(traces[traceIndex].from).toEqual(
                    "0x66126b4aa2a1c07536ef8e5e8bd4efda1fdea96d"
                )
                expect(traces[traceIndex].to).toEqual(
                    "0x6efa260a268e4afacf7fb91a6bf5f5b37379bf61"
                )
                expect(traces[traceIndex].funcSelector).toEqual("0x2bf596cf")
                expect(traces[traceIndex].parentTrace?.id).toEqual(2)
                expect(traces[traceIndex].childTraces).toHaveLength(0)
            })
        })
        test("create contract", async () => {
            const traces = await nodeClient.getTransactionTrace(
                "0xef0ef332690119a0174f26c3ce40edfd4e57d138bb5c95a081e3d66ee571e706"
            )
            expect(traces).toHaveLength(4)
            expect(traces[0].type).toEqual(MessageType.Call)
            expect(traces[1].type).toEqual(MessageType.Create)
            expect(traces[1].address).toEqual(
                "0xc64c80adde0e8e3e491d0b3253265359f1b30882"
            )
            expect(traces[1].constructorParams).toMatch(bytes)
            expect(traces[1].value).toEqualBN(0)
            expect(traces[1].from).toEqual(
                "0xc0a47dfe034b400b47bdad5fecda2621de6c4d95"
            )
            expect(traces[1].to).toEqual(
                "0xc64c80adde0e8e3e491d0b3253265359f1b30882"
            )
            expect(traces[1].gasLimit).toEqualBN(180176)
            expect(traces[1].gasUsed).toEqualBN(9230)
        })
        test("selfdestruct", async () => {
            const traces = await nodeClient.getTransactionTrace(
                "0x47f7cff7a5e671884629c93b368cb18f58a993f4b19c2a53a8662e3f1482f690"
            )
            expect(traces).toHaveLength(2)
            expect(traces[0].type).toEqual(MessageType.Call)
            expect(traces[1].type).toEqual(MessageType.Selfdestruct)
            expect(traces[1].from).toEqual(
                "0x863df6bfa4469f3ead0be8f9f2aae51c91a907b4"
            )
            expect(traces[1].delegatedFrom).toEqual(
                "0x863df6bfa4469f3ead0be8f9f2aae51c91a907b4"
            )
            expect(traces[1].to).toEqual(
                "0x863df6bfa4469f3ead0be8f9f2aae51c91a907b4"
            )
            expect(traces[1].address).toEqual(
                "0x863df6bfa4469f3ead0be8f9f2aae51c91a907b4"
            )
            expect(traces[1].refundAddress).toEqual(
                "0xae7168deb525862f4fee37d987a971b385b96952"
            )
            expect(traces[1].value).toEqualBN(0)
            expect(traces[1].balance).toEqualBN(0)
        })
        test("failed transaction", async () => {
            const messages = await nodeClient.getTransactionTrace(
                "0x0a99314379caf3dcbbc6e1f5b0dda8a41e3a8b5a0d9b1c1ec744be1f1cf781ea"
            )
            expect(messages).toHaveLength(2)
            expect(messages[0].error).toBeUndefined()
            expect(messages[1].error).toEqual("Reverted")
            expect(messages[1].type).toEqual(MessageType.Call)
            expect(messages[1].gasLimit).toEqualBN(100591)
            expect(messages[1].gasUsed).toBeUndefined()
            expect(messages[1].funcSelector).toEqual("0xa9059cbb")
            expect(messages[1].value).toEqualBN(0)
        })
        test("1inch tx success, but an internal call failed", async () => {
            const traces = await nodeClient.getTransactionTrace(
                "0x5127c14ab29ad659b1f1063fcf022d990cf00970dae8160693ccc8b9561d4b4d"
            )
            expect(traces).toHaveLength(44)
            expect(traces[0].error).toBeUndefined()
            expect(traces[1].error).toBeUndefined()
            expect(traces[2].error).toBeUndefined()
            expect(traces[3].error).toEqual("Reverted")
            expect(traces[4].error).toBeUndefined()
        })
        test("no tx hash", async () => {
            expect.assertions(2)
            try {
                await nodeClient.getTransactionTrace(
                    "0x47f7cff7a5e671884629c93b368cb18f58a993f4b19c2a53a866000000000000"
                )
            } catch (err) {
                expect(err).toBeInstanceOf(Error)
                expect(err.message).toMatch("receipt could not be found")
            }
        })
    })
    describe("Get transaction details", () => {
        test("delegate call", async () => {
            const tx = await nodeClient.getTransactionDetails(
                "0xe5e35ee13bb6326df4da89f17504a81923299d4986de06a019ca7856cbe76bca"
            )
            expect(tx.from).toEqual(
                "0x7A39608107DC014d4bBd7A5F01d3FbA5Dff6D042"
            )
            expect(tx.to).toEqual("0x2C4Bd064b998838076fa341A83d007FC2FA50957")
            expect(tx.nonce).toEqual(224)
            expect(tx.timestamp).toEqual(new Date("24-Feb-2020 21:30:47 UTC"))
            expect(tx.gasLimit).toEqualBN(83173)
            expect(tx.gasPrice).toEqualBN(1000000000)
            expect(tx.gasUsed).toEqualBN(59813)
            expect(tx.status).toBeTruthy()
        })
        test("Failed Uniswap v2", async () => {
            const tx = await nodeClient.getTransactionDetails(
                "0x925109efeb515b8b785cdd5fc74fbbbfa69a46a46d4dcfe0b0407715b2182bfe"
            )
            expect(tx.from).toEqual(
                "0xAA6ebF8aEa80261E5e45205635bc1ca3553B1098"
            )
            expect(tx.to).toEqual("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
            expect(tx.nonce).toEqual(142)
            expect(tx.timestamp).toEqual(new Date("29-Dec-2020 23:02:16 UTC"))
            expect(tx.gasLimit).toEqualBN(155268)
            expect(tx.gasPrice).toEqualBN(58000000000)
            expect(tx.gasUsed).toEqualBN(28889)
            expect(tx.status).toBeFalsy()
        })
        test("Failed internal 1inch", async () => {
            const tx = await nodeClient.getTransactionDetails(
                "0x5127c14ab29ad659b1f1063fcf022d990cf00970dae8160693ccc8b9561d4b4d"
            )
            expect(tx.status).toBeTruthy()
        })
    })
    describe("Get token details", () => {
        test("Get Maker with bytes32 function outputs", async () => {
            const tokenDetail = await nodeClient.getTokenDetailsUnknownABI(
                maker
            )
            expect(tokenDetail.symbol).toEqual("MKR")
            expect(tokenDetail.name).toEqual("Maker")
        })
        test("Get Uniswap string function outputs", async () => {
            const tokenDetail = await nodeClient.getTokenDetailsUnknownABI(
                uniswap
            )
            expect(tokenDetail.symbol).toEqual("UNI")
            expect(tokenDetail.name).toEqual("Uniswap")
        })
        test("Get USDC from proxy", async () => {
            const tokenDetail = await nodeClient.getTokenDetailsUnknownABI(
                usdcProxy
            )
            expect(tokenDetail.symbol).toEqual("USDC")
            expect(tokenDetail.name).toEqual("USD Coin")
        })
        test("USDC implementation", async () => {
            const tokenDetails = await nodeClient.getTokenDetailsUnknownABI(
                usdcImpl
            )
            expect(tokenDetails.symbol).toBeUndefined()
            expect(tokenDetails.name).toBeUndefined()
        })
        test("mStableUSD proxy", async () => {
            const tokenDetail = await nodeClient.getTokenDetailsUnknownABI(
                mStableUSDProxy
            )
            expect(tokenDetail.symbol).toEqual("mUSD")
            expect(tokenDetail.name).toEqual("mStable USD")
        })
        test("mStableUSD implementation", async () => {
            const tokenDetail = await nodeClient.getTokenDetailsUnknownABI(
                mStableUSDImpl
            )
            expect(tokenDetail.symbol).toBeUndefined()
            expect(tokenDetail.name).toBeUndefined()
        })
        test("Get tokens with string and bytes32 outputs", async () => {
            const tokenDetail = await nodeClient.getTokenDetailsUnknownABI(dai)
            expect(tokenDetail.symbol).toEqual("DAI")
            expect(tokenDetail.name).toEqual("Dai Stablecoin")
        })
        test("externally owned account with string token ABI", async () => {
            const tokenDetail = await nodeClient.getTokenDetailsUnknownABI(
                externallyOwnerAccount
            )
            expect(tokenDetail.symbol).toBeUndefined()
            expect(tokenDetail.name).toBeUndefined()
        })
    })
})
