// import { Button } from '@/componentss/ui/button';

// import { defaultExpresion } from '../../../../workflow/BPMN/Helper/helper';

// export const ChildExpresionPanel = ({
//   selectedOptn,
//   setselectedOptn,
//   selectedType,
//   expresionPanelList,
//   expression,
//   handleExpression,
//   handleSelectOptn,
//   setSecondExp,
//   setFilledJsonObj,
//   setExpression
// }) => {

//   const handleTextAreaChange = (event) => {
//     const newText = event.target.value;
//     setExpression(newText);
//   };
//   return (
//     <>
//       <div id="set-variable-panel" className={`panel expression-panel2`}>
//         <form id="setFormxpression12">
//           <p>
//             <b>Expression Panel</b>
//           </p>

//           <Button
//             id="close"
//             className="close-btn"
//             type="button"
//             onClick={() => setSecondExp(false)}
//           >
//             &times;
//           </Button>

//           <table>
//             <tr className="flex">
//               <td>
//                 <label>
//                   Select Opeartion
//                   <br />
//                   expresionPanelList Field
//                 </label>
//                 <div>
//                   <select
//                     style={{
//                       border: '1px solid #d6d2d2',
//                       height: 325,
//                       width: 240,
//                       overflowX: 'scroll'
//                     }}
//                     className="p-3"
//                     multiple
//                     value={selectedOptn?.secondExp}
//                     onChange={(event) => {
//                       setselectedOptn({ secondExp: event.target.value });
//                       selectedType !== ''
//                         ? handleExpression(event.target.value)
//                         : handleSelectOptn(event.target.value);
//                     }}
//                   >
//                     {expresionPanelList
//                       .filter((o) => o.label !== 'Transformation')
//                       .map((item, i) => (
//                         <option key={i} value={item.value} className="my-1">
//                           {item.label}
//                         </option>
//                       ))}
//                   </select>
//                 </div>
//               </td>
//               <td>
//                 <div className="flex items-center">
//                   <label>
//                     Write <br />
//                     expression
//                   </label>
//                 </div>

//                 <div>
//                   <textarea
//                     rows={13}
//                     cols={17}
//                     type="text"
//                     value={expression}
//                     onChange={handleTextAreaChange}
//                     // onBlur={generateExpression}
//                   />
//                 </div>
//               </td>
//             </tr>
//           </table>
//           <div className="flex">
//             <div>
//               <Button onClick={(e) => submitCoExpression(e)}>Ok</Button>
//             </div>
//             <div>
//               <Button onClick={() => setSecondExp(false)}>Close</Button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };
