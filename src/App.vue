<template>
  <div id="app">
    
    <div class="container">
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="#">Baan Nai Din @book-store</b-navbar-brand>
      </b-navbar>

      <div align="left">
        <b-jumbotron header="Baan Nai Din" lead="Promotion available now!">
          <div align="right">
            <b-button size="lg" variant="warning" class="mr-2" v-b-modal.cart-modal>
              Shopping Cart
            </b-button>
            <b-modal id="cart-modal" title="Shopping Cart" ref="cart-modal">
              <h2>Your products</h2>
              <p id="cartModalText" v-for="element in itemInCart" :key="element.ID">
                <b>Name :</b> {{ element.name }} || <b>Amount :</b> {{ element.amount }}
              </p>
              <template v-slot:modal-footer="">
                <b-button size="md" variant="secondary" @click="itemInCart = []">
                  Clear Cart
                </b-button>
                <b-button size="md" variant="success" @click="purchase()">
                  Place Order
                </b-button>
              </template>
            </b-modal>
          </div>
        </b-jumbotron>

        <template>
          <div>
            <b-modal ref="succes-modal" hide-footer title="Purchase status">
              <div class="d-block text-center">
                <h1>Purchased!!</h1>
                <p>Total book : <b>{{this.resTotalBook}}</b></p>
                <p>Total price : <b>{{this.resTotalBook*100}}</b> baht</p>
                <p>Discount : <b>{{this.resDiscount}}</b> baht</p>
                <p>Net price : <b>{{this.resPrice}}</b> baht</p>
              </div>
              <div align="right">
                <b-button size="md" variant="success" @click="hideSucModal">
                    OK
                </b-button>
              </div>
            </b-modal>
          </div>
        </template>
        
      </div>

      <b-table striped :items="itemsFromDB" :fields="fields">
        <template v-slot:cell(activities)="data" >
          <b-button size="sm" @click="add2cart(data.item.ID)" variant="success" class="mr-2"> Add to Cart </b-button>
        </template>
      </b-table>
    </div>

  </div>
</template>

<script>
import cartProvider from './provider'

export default {
  name: 'app',
  data () {
    return {
      fields: [{ key: 'name', label: 'Book Name' }, 'price','activities'],
      itemsFromDB: [
          { ID: '1001', name: 'Harry Potter : Philosopher\'s stone', price: 100 },
          { ID: '1002', name: 'Harry Potter : Chamber of Secrets', price: 100 },
          { ID: '1003', name: 'Harry Potter : Prisoner of Azkaban', price: 100 },
          { ID: '1004', name: 'Harry Potter : Goblet of Fire', price: 100 },
          { ID: '1005', name: 'Harry Potter : Order of the Phoenix', price: 100 },
          { ID: '1006', name: 'Harry Potter : Half-Blood Prince', price: 100 },
          { ID: '1007', name: 'Harry Potter : Dealthy Hallows', price: 100 },
      ],
      itemInCart:[],
      toastCounter: 0,
      resPrice:0,
      resDiscount:0,
      resTotalBook:0
    }
  }, 
  methods: {
    add2cart (book_ID) {
      let flag = false
      let msg = ''

      if(this.itemInCart.length > 0){
        this.itemInCart.forEach( element => {
          if (element.ID == book_ID)
          {
            flag = true
            element.amount++

            //make something to effect with array
            this.itemInCart.push('space')
            this.itemInCart.pop()
          }
        })
      }
      
      if(!flag){
        let book = {};

        let curBook = this.itemsFromDB.filter(
          item => item.ID === book_ID
        )
        book.ID = book_ID
        book.name = curBook[0].name
        book.amount = 1
        this.itemInCart.push(book)
        msg = book.name + ' has been added.'
      }

      this.toast('b-toaster-top-right','Add book completed.',msg)
      // eslint-disable-next-line no-console
      //console.log('Item in Cart : ',this.itemInCart)

    },

    toast(toaster,title,msg,append = false) {
      this.toastCounter++
      this.$bvToast.toast(msg, {
        title: title,
        toaster: toaster,
        solid: true,
        appendToast: append
      })
    },

    showSucModal() {
      this.$refs['succes-modal'].show()
    },

    hideSucModal() {
      this.$refs['succes-modal'].hide()
    },

    async purchase(){
      let confirmed = this.itemInCart
      let resp = await cartProvider({"data" : confirmed})
      let data = resp.res
      this.resPrice = data.price
      this.resDiscount = data.discount 
      this.resTotalBook = data.totalBook

      // eslint-disable-next-line no-console
      //console.log(resp)
      
      if(resp){
        this.$refs['cart-modal'].hide()
        this.showSucModal(resp.res)
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
