// import {
//     NativeModules,
//     NativeEventEmitter,
// } from 'react-native';
//
// const {SMPIEmitter: EE} = NativeModules;
//
// const init = (o) => {
//     const eeIns = new NativeEventEmitter(EE);
//     eeIns.addListener('onOutput', (msg) => {
//         o(msg.data);
//     });
//
//     const input = async (i_msg) => {
//         const x = await EE.input(i_msg);
//         console.log({x});
//         return x;
//     };
//
//     return {
//         input,
//     };
// };
//
//
//
//
//
//
//
// export {
//     init,
// };
