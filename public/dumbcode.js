...
this.items = Object.values(snapshot.val())


<template v-for="item in items"></template>
    <button @click="incItem(item, 1)">{{item[0]}}</button>
    <button @click="incItem(item, 6)">6</button>
    <button @click="incItem(item, 10)">10</button>
    <input min="item[min]" max="item[max]" v-model="item[qty]" type="number">
</template>