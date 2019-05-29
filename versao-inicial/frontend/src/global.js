import Vue from 'vue'

export const baseApiUrl ='http://localhost:3000'

export function showError(e){
    if( e && e.response && e.response.data ){
        Vue.toasted.global.defaultError({ msg: e.response.data })
    } else if(typeof e ==='string'){
        Vue.toasted.global.defaultError({ msg: e })
    } else {
        Vue.toasted.global.defaultError()
    }
}

export function dateFormat(date){
    const dateReturn = date.split('-')
    return `${dateReturn[2]}/${dateReturn[1]}/${dateReturn[0]}`
}

export default { baseApiUrl, showError, dateFormat }

   