  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
  import { getDatabase, ref, onValue, child, get, set } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
  const { createApp } = Vue;

    const firebaseConfig = {
      //firebase config
    };

    // init firebase db
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    // init vue
    createApp({
      data() {
        return {
          dataReady: false,
          vendOrMart: 'Vending',
          title: 'RMA FROZEN SHEET',
          isToggled: true,
          admin: false,
          showitup: false,
          newItem: '',
          newAvail: '',
          newMinimum: 0,
          newMaximum: 0,
          newCategory: '',
          rtName: 'Route 1',
          accountName: '',
          pickLine: false,
          order: {},
          items: []
        }
      },
      mounted() {
        this.getData()
      },
      methods: {
        async getData() {
          try {
          console.log('getting data!')

          const itemsRef = ref(database, 'items')
          const snapshot = await get(itemsRef)
          
          this.items = Object.values(snapshot.val())
          this.dataReady = true

          } catch (error) {
            console.error(error)
          }
        },
        addNewItem() {

          const db = getDatabase();
          set(ref(db, 'items/' + this.newNumber), {
            0: this.newItem,
            1: this.newAvail,
            2: this.newMinimum,
            3: this.newMaximum,
            4: this.newCategory,
            5: 0
          }).then(() => {
            alert('saved!')
            this.newItem = ''
            this.newAvail = ''
            this.newMinimum = 0
            this.newMaximum = 0
            this.newCategory = ''
            this.getData()
          }).catch(() => {
            console.log('failed!')
          })

          

        },
        incItem(idx, amt) { 
          if ((idx[5] + amt) >= idx[3]) {
            idx[5] = idx[3] 
            this.order[idx[0]] = idx[3] // it was just missing this line, so anything that put it over max wasn't registering
          } else {
            idx[5] += amt 
            if (this.order[idx[0]] == undefined) { this.order[idx[0]] = 0 } 
              this.order[idx[0]] = this.order[idx[0]] + amt
          }
        },

        decItem(idx, amt) {
          if((idx[5] - amt) <= 0) {
            idx[5] = 0
            this.order[idx[0]] = 0
          } else {
            idx[5] -= amt           
            this.order[idx[0]] -= amt
          }
        },
        asToggle() {
          this.isToggled = !this.isToggled
        }
      },
      computed: {
        newNumber() {
          return this.items.length + 1
        }
      }
    }).mount('#app')

