const { assert } = require('chai')
const { default: Web3 } = require('web3')
const NFT = artifacts.require("NFT")
const keccak256 = require('keccak256')


require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('NFT', ([deployer, owner, user]) => {
  let nftmint

  before(async () => {
    nftmint = await NFT.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await nftmint.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has base uri', async () => {
      const baseURI = await nftmint.baseURI()
      assert.equal(baseURI, "uri")
    })

    it('has a name, symbol and correct owner', async () => {
      const name = await nftmint.name()
      const symbol = await nftmint.symbol()
      const owner = await nftmint.owner()
      assert.equal(name, 'ccollectable')
      assert.equal(symbol, 'CC')
      assert.equal(owner, '0x1D35cb8660D189cD2BA6722364aA0E0cFa6E2bE9')
    })
  })

  describe('mint_nft', async () => {
    it('minted successfully', async () => {
      const owner = await nftmint.owner()
      const result = await nftmint.mint(owner, 2)
      // console.log(result)
      const baseURI = await nftmint.baseURI()
      const maxSupply = await nftmint.maxSupply()
      const nftbalanceOfowner = await nftmint.balanceOf(owner)
      const ownerOf = await nftmint.ownerOf(1)
      assert.equal(baseURI, "uri")
      assert.equal(maxSupply, 10000)
      assert.equal(nftbalanceOfowner, 3)
      assert.equal(ownerOf, "0x1D35cb8660D189cD2BA6722364aA0E0cFa6E2bE9")
    })
  })

  describe('transfer_nft', async() => {
    it('transfer successfully', async() => {
      const owner = await nftmint.owner()
      const user = "0x7Daa7412cFB5d0666B9E02Da0f7EAF604E061a35"
      const safeTransferFrom2 = await nftmint.safeTransferFrom(owner, user, 2)
      const safeTransferFrom3 = await nftmint.safeTransferFrom(owner, user, 3)
      const nftbalanceOfuser = await nftmint.balanceOf(user)
      const ownerOf2 = await nftmint.ownerOf(2)
      const ownerOf3 = await nftmint.ownerOf(3)
      assert.equal(nftbalanceOfuser, 2)
      assert.equal(ownerOf2, user)
      assert.equal(ownerOf3, user)
    })
  })

  describe('is_claimable', async() => {
    it('condition matched', async() => {
      const owner = await nftmint.owner()
      const user = "0x7Daa7412cFB5d0666B9E02Da0f7EAF604E061a35"
      const nftbalanceOfuser = await nftmint.balanceOf(user)
      const ownerOf2 = await nftmint.ownerOf(2)
      const ownerOf3 = await nftmint.ownerOf(3)
      assert.equal(nftbalanceOfuser, 2)
      if (ownerOf2 == ownerOf3) {
        const canbeclaim = await nftmint.isclaimable()
        // console.log(canbeclaim)
      }
    })
  })

  describe('reward_claimed', async() => {
    it('claim successfully', async() => {
      const owner = await nftmint.owner()
      const user = "0x7Daa7412cFB5d0666B9E02Da0f7EAF604E061a35"
      const balanceOfuser = await nftmint.balanceOf(user)
      const blannceOfowner = await nftmint.balanceOf(owner)
      assert.equal(blannceOfowner, 1)
      assert.equal(balanceOfuser, 2)
      const safeTransferFrom2 = await nftmint.safeTransferFrom(user, owner, 2, {from: user})
      const safeTransferFrom3 = await nftmint.safeTransferFrom(user, owner, 3, {from: user})
      const safeTransferFrom1 = await nftmint.safeTransferFrom(owner, user, 1)
      const ownerOf2 = await nftmint.ownerOf(2)
      const ownerOf3 = await nftmint.ownerOf(3)
      const ownerOf1 = await nftmint.ownerOf(1)
      assert.equal(ownerOf2, owner)
      assert.equal(ownerOf3, owner)
      assert.equal(ownerOf1, user)
      if(ownerOf1 == user){
        const canbeclaim = await nftmint.isclaimable()
        // console.log(keccak256(true).toString('hex'))
        const rewardclaimed = await nftmint.ReturnKeccak()
        console.log(rewardclaimed)
      }
    })
  })
})