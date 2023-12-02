import moment from 'moment';
export default defineNuxtPlugin(() => {
    return {
      provide: {
        moment: moment,
        percent:(value:string | number | null,rate=1)=>{
        // code here
          if(value==null)return "--";
          const result=Math.round(+value*rate*1000)/10;
          return result.toFixed(1)+"%";
        },
        localNumber:(value:string | number | null,isLetter=false)=>{
          if(value==null)return "--";
          else if(isLetter){
            if(+value>1000000 || +value<-1000000)return Math.ceil(+value/1000000)+'M';
            else if(+value>1000 || +value<-1000)return Math.ceil(+value/1000)+'K';
            else return value;
          }return value.toLocaleString();
        },
        numberColor:(value:string | number | null)=>{
          if(value==null)return "--";
          else if(+value>=0)return "text-success";
          else return "text-error";
        }
      }
    }
  })