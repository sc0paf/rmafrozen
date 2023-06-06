  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
  import { getDatabase, ref, onValue, child, get, set } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
  const { createApp } = Vue;

    const firebaseConfig = {
      apiKey: "AIzaSyCcw5jd8XSjcz1SXTWdUnEeUat8kNUePeM",
      authDomain: "rmafr-22482.firebaseapp.com",
      databaseURL: "https://rmafr-22482-default-rtdb.firebaseio.com",
      projectId: "rmafr-22482",
      storageBucket: "rmafr-22482.appspot.com",
      messagingSenderId: "575367101291",
      appId: "1:575367101291:web:6cbee6e5e6dc52773f6a2e",
      measurementId: "G-HF0KQF0L8R",
      databaseURL: "https://rmafr-22482-default-rtdb.firebaseio.com"
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
          driver: true,
          showitup: false,
          today: new Date().toJSON().slice(0, 10),
          newItem: '',
          newAvail: true,
          newMinimum: 0,
          newMaximum: 0,
          newDate: '',
          havePick: false,
          newCategory: '',
          rtName: 'Route 1',
          accountName: '',
          toPick: {},
          pickLine: false,
          pickDate: new Date().toJSON().slice(0, 10),
          order: {},
          fullItems: {},
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
          
          //this.items = Object.values(snapshot.val())
          this.items = snapshot.val()
          this.dataReady = true

          } catch (error) {
            console.error(error)
          }
        },
        addNewItem() {
          const db = getDatabase();
          set(ref(db, 'items/' + this.newNumber), {
            'name': this.newItem,
            'avail': this.newAvail,
            'min': this.newMinimum,
            'max': this.newMaximum,
            'category': this.newCategory,
            'placeholder': 0
          }).then(() => {
            alert('saved!')
            this.newItem = ''
            this.newAvail = false
            this.newMinimum = 0
            this.newMaximum = 0
            this.newCategory = ''
            this.getData()
          }).catch(() => {
            console.log('failed!')
          })
        },
        async getOrders() {
          const db = getDatabase();
          this.toPick = 'Please wait...'
          //const ordersRef = ref(database, 'orders/' + this.pickDate + '/' + this.rtName)

          try {
            console.log('getting data!')
  
            const itemsRef = ref(database, 'orders/' + this.pickDate + '/' + this.rtName)
            const snapshot = await get(itemsRef)
            
            //this.items = Object.values(snapshot.val())
            this.toPick = snapshot.val()
            this.havePick = true
  
            } catch (error) {
              console.error(error)
            }


        },
        sendOrder() {
          if (!this.newDate || !this.rtName) {
            alert('Select a date & route!')
            return
          } else {
          const db = getDatabase();
          set(ref(db, 'orders/' + this.newDate + '/' + this.rtName + '/' + this.accountName), this.order).then(() => {
            alert('saved!')
            this.order = {}
            this.accountName = ''
            items.forEach(item => {
              item['placeholder'] = 0 
            })
          })
        }
        },
        incItem(item, amount) { 
          if ((item['placeholder'] + amount) >= item['max']) { 
            item['placeholder'] = item['max']
            this.order[item['name']] = item['max']
          } else {
            item['placeholder'] += amount
            if (this.order[item['name']] == undefined) { this.order[item['name']] = 0 }  
              this.order[item['name']] = this.order[item['name']] + amount
          }
        },
        decItem(item, amount) {
          if((item['placeholder'] - amount) <= 0) {
            item['placeholder'] = 0
            this.order[item['name']] = 0
          } else {
            item['placeholder'] -= amount           
            this.order[item['name']] -= amount
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

