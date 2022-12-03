<template>
<h1 @click="dynamicFilter">Data Visulaiser</h1>

<table  class="table table-striped table-hover">
  <thead>
    <th>First name</th>
    <th>Last name</th>
    <th>Role</th>
    <th>Grade</th>
    <th>Total attendance</th>
    <th>Last 4</th>
   
  </thead>
  <tbody  class="table-group-divider">
    <tr v-for="name in attendance" :key="JSON.stringify(name)">
      <td>{{name.first}}</td>
      <td>{{name.last}}</td>
      <td>{{name.role}}</td>
      <td>{{name.grade}}</td>
      <td>{{name.totalAttendance}}</td>
      <td>{{name.last4}}</td>

    </tr>
  </tbody>
</table>
</template>

<script>
  import attendance from '../assets/attendance.json';
  export default {
    data:()=>({
      attendance:[],
      filters:[]
    }),
    methods:{
      calculateAttendance(arr){
        return arr.length
      },
      getLastAttendance(arr){
        if (arr.length===0) return "nil"
        return arr.slice(-4).map(v=>
        new Intl.DateTimeFormat('en-AU', { dateStyle: 'short', timeZone: 'Australia/Sydney'}).format(new Date(v)
        )).join(', ')
        
      },
   dynamicFilter () {
    const filters = { grade: ['G2','G3'] ,
     role: ['Servant'] 
     ,totalAttendance:[]
   }
      this.attendance= Object.keys(filters)
      .reduce((a, b) => filters[b].length>0?
      a.filter(v => filters[b].includes(v[b]) ):a, 
      this.attendance)
    }
  },
    mounted(){
      this.attendance=attendance.map(v=>({...v, 
        totalAttendance:v.attendance.length,
         last4:this.getLastAttendance(v.attendance)}));
    }



}

</script>

<style scoped>

</style>