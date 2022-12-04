<template>
<h1 class="text-center" @click="dynamicFilter">Data Visualiser</h1>
<form @submit="dynamicFilter">
<div class="row">
<div class="row col-4">
  <p class="m-0 text-danger font-weight-bold">Grades</p>
  <div v-for="grade in primaryGrades" class="col-6">
    <input type="checkbox" :id="grade" :value="grade" v-model="filters.grade">
    <label :for="grade" class="ps-2">{{grade}}</label>
  </div>  
</div>
<div class="row col-4">
  <p class="m-0 text-danger font-weight-bold">Roles</p>
  <div v-for="role in roles" class="col-12">
    <input type="checkbox" :id="role" :value="role" v-model="filters.role">
    <label :for="role" class="ps-2">{{role}}</label>
  </div>  
</div>
<div class="row col-4">
  <p class="m-0 text-danger font-weight-bold">Total Attendance</p>
  <label for="lessThan">Less than</label>
  <input type="number" name="lessThan" id="lessThan" class="form-control" v-model="filters.totalAttendance[0]">
  <label for="greaterThan">Greater than or Equal</label>
  <input type="number" name="greaterThan" id="greaterThan" class="form-control" v-model="filters.totalAttendance[1]">
</div>
</div>
<div class="d-flex align-items-center mt-2 justify-content-end">
  <button class="btn btn-outline-danger px-5 mx-5" type="reset" @click="clearFilters">Clear filters</button>
  <button class="btn btn-danger px-5" type="submit" >Submit</button>
  <a :href="`data:text/plain;charset=utf-8,${createCSV()}`" download="sundaySchools.csv" class="btn btn-primary d-block mx-3">Download CSV</a>
</div>

</form>

<table  class="table table-striped table-hover">
  <thead>
    <th>#</th>
    <th v-for="header in tableHeaders" :key="header.name">
      {{header.name}}
    </th>
  
  </thead>
  <tbody  class="table-group-divider">
    <tr v-for="(person,index) in filteredAttendance" :key="index">
      <td>{{(index+1)}}</td>
      <td v-for="detail in tableHeaders" :key="`${detail}-${index}`">
        {{person[detail.fieldName]}}
        </td>
    </tr>
  </tbody>
</table>
</template>

<script>
  import {tableHeaders,primaryGrades,roles,emptyStateFilters} from '../constants';
  import {deepClone} from '../utils';
  import axios from 'axios';
  export default {
    data:()=>({
      attendance:[],
      filters:deepClone(emptyStateFilters),
      tableHeaders,
      primaryGrades,
      roles,
      filteredAttendance:[]
    }),
    methods:{
      createCSV(){
        const fields = tableHeaders.map(header=>header.fieldName).join(',');
        const jsonData=this.filteredAttendance;
        try{
           const y=jsonData.reduce((a,b)=>{
            let rowArray=[];
              for(let key in b){
                if(key!=='attendance')
                rowArray.push(key==='last4'? b[key].replaceAll(","," -"):b[key])
              }
              return a+'\n'+ rowArray.join(',')
           },fields)
            return y;

        }catch(err){
          console.error(err);
        }
      },
      clearFilters(e){
        e.preventDefault();
        this.filters=deepClone(emptyStateFilters);
      },
      calculateAttendance(arr){
        return arr.length
      },
      getLastAttendance(arr){
        if (arr.length===0) return "nil"
        return arr.slice(-4).map(v=>
        new Intl.DateTimeFormat('en-AU', { dateStyle: 'short', timeZone: 'Australia/Sydney'}).format(new Date(v)
        )).join(', ')
        
      },
   dynamicFilter (e) {
    e.preventDefault();
    console.log(this.filters);
    const filters = this.filters;
      this.filteredAttendance= Object.keys(filters)
      .reduce((a, b) => filters[b].length>0?
      a.filter(v => 
        b==='totalAttendance'?
        v[b]<Number(filters[b][0]) || v[b]>=Number(filters[b][1]):
        filters[b].includes(v[b]) 
      ):a, 
      this.attendance)
    }
  },
    async mounted(){
      const {data:attendance}=await axios.get('https://script.google.com/macros/s/AKfycbxjSRtONdQLFl-YpPKAmzS0-z3uebTm_IZKQpDBm8gKZwBUtRQbdb6Bdte8eEulSLlY3Q/exec'); 
      console.log(attendance);
      const sortedPeople=primaryGrades.reduce((a,b)=>[...a,...attendance.filter(p=>p.grade===b)],[]);
      const sortedAttendanceList=sortedPeople.map(v=>({...v, 
        totalAttendance:v.attendance.length,
         last4:this.getLastAttendance(v.attendance)}));
         this.filteredAttendance=sortedAttendanceList
         this.attendance=sortedAttendanceList
        }
        
    



}

</script>

<style scoped>
form {
  background-color: rgb(231, 228, 228);
  padding: 1rem;
  border-radius: .8rem;
  margin-bottom: .5rem;
  border:1px solid grey;
}
.font-weight-bold{
  font-weight: 700;
}
</style>