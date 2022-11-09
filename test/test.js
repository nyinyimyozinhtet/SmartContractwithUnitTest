const { assert } = require('chai')
const { default: Web3 } = require('web3')
const NFT = artifacts.require("NFT")

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
      const result = await nftmint.mint(owner, 1)
      // console.log(result)
      const baseURI = await nftmint.baseURI()
      const maxSupply = await nftmint.maxSupply()
      const balanceOf = await nftmint.balanceOf(owner)
      const ownerOf = await nftmint.ownerOf(1)
      assert.equal(baseURI, "uri")
      assert.equal(maxSupply, 10000)
      assert.equal(balanceOf, 2)
      assert.equal(ownerOf, "0x1D35cb8660D189cD2BA6722364aA0E0cFa6E2bE9")
    })
  })

  describe('transfer_nft', async() => {
    it('transfer successfully', async() => {
      const owner = await nftmint.owner()
      const user = "0x7Daa7412cFB5d0666B9E02Da0f7EAF604E061a35"
      const safeTransferFrom = await nftmint.safeTransferFrom(owner, user, 2)
      const balanceOf = await nftmint.balanceOf(user)
      const ownerOf1 = await nftmint.ownerOf(1)
      const ownerOf2 = await nftmint.ownerOf(2)
      assert.equal(balanceOf, 1)
      assert.equal(ownerOf1, owner)
      assert.equal(ownerOf2, user)
    })
  })

//   describe('images', async () => {
//     let result, imageCount
//     const hash = 'abc123'
//     before(async () => {
//       result = await nftmint.uploadImage(hash, 'Image description', { from: owner })
//       imageCount = await nftmint.imageCount()
//     })

//     it('creates images', async () => {
//       // Success
//       assert.equal(imageCount, 1)
//       const event = result.logs[0].args
//       assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
//       assert.equal(event.hash, hash, 'Hash is correct')
//       assert.equal(event.description, 'Image description', 'descriprion is correct')
//       assert.equal(event.tipAmount, '0', 'tip amount is correct')
//       assert.equal(event.author, author, 'author is correct')

//       // Failure: Image must have hash
//       await nftmint.uploadImage('', 'Image description', { from: author }).should.be.rejected;
//       // Failure: Image must have description
//       await nftmint.uploadImage('Image hash', '', { from: author }).should.be.rejected;
//     })
//     // check from Struct
//     it('lists images', async () => {
//       const image = await nftmint.images(imageCount)
//       assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
//       assert.equal(image.hash, hash, 'Hash is correct')
//       assert.equal(image.description, 'Image description', 'description is correct')
//       assert.equal(image.tipAmount, '0', 'tip amount is correct')
//       assert.equal(image.author, author, 'author is correct')
//       // console.log(imageCount.toNumber())
//     })

//     it('allows users to tip images', async () => {
//       // Track the author balance before purchase
//       let oldAuthorBalance
//       oldAuthorBalance = await web3.eth.getBalance(author)
//       oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
//       // console.log(oldAuthorBalance)
//       result = await nftmint.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

//       // Success
//       const event = result.logs[0].args
//       assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
//       assert.equal(event.hash, hash, 'Hash is correct')
//       assert.equal(event.description, 'Image description', 'description is correct')
//       assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
//       assert.equal(event.author, author, 'author is correct')

//       //Check that author receiver funds
//       let newAuthorBalance
//       newAuthorBalance = await web3.eth.getBalance(author)
//       newAuthorBalance = new web3.utils.BN(newAuthorBalance)

//       let tipImageOwner
//       tipImageOwner = web3.utils.toWei('1', 'Ether')
//       tipImageOwner = new web3.utils.BN(tipImageOwner)

//       const expectedBalance = oldAuthorBalance.add(tipImageOwner)

//       assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

//       // Failure: Tries to tip a image that does not exist
//       await nftmint.tipImageOwner(99, { from: tipper, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected
//     })
//   })
})