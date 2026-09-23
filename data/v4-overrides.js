(() => {
'use strict';

function setExample(L,i,question,answer,method){
  if(!L?.examples?.[i]||!L?.solutions?.examples?.[i])return;
  L.examples[i].question=question;
  L.solutions.examples[i].answer=answer;
  L.solutions.examples[i].method=method;
}
function reorder(L,order){
  const q=L.practice.slice(),a=L.solutions.practice.slice(),s=(L.practiceSources||[]).slice();
  L.practice=order.map(i=>q[i]).filter(x=>x!==undefined);
  L.solutions.practice=order.map(i=>a[i]).filter(x=>x!==undefined);
  L.practiceSources=order.map(i=>s[i]||'').slice(0,L.practice.length);
}
function reorderHomework(L,order){
  const q=L.homework.slice(),a=L.solutions.homework.slice();
  L.homework=order.map(i=>q[i]).filter(x=>x!==undefined);
  L.solutions.homework=order.map(i=>a[i]).filter(x=>x!==undefined);
}
function apply(data){
  for(const L of data||[]){
    if(L._v4)return;
    L.examples.forEach((ex,i)=>{ex.level=['Foundation','Representation / application','Reasoning / challenge'][i]||ex.level});
    if(L.practice.length>=24) reorder(L,[0,1,2,3,4,5,6,7,8,9,10,11,20,12,21,13,14,15,22,16,23,17,18,19]);
    if(L.homework.length>=14) reorderHomework(L,[0,1,2,3,4,5,12,6,7,13,8,9,10,11]);
    L._v4=true;
  }

  let L=data.find(x=>x.lesson===1);
  if(L){
    setExample(L,0,'Work out 48,705 + 6,938.','55,643','Align place values. Add from right to left and regroup where a column totals 10 or more. Estimate: 49,000 + 7,000 ≈ 56,000.');
    setExample(L,1,'A school orders 36 boxes of 48 exercise books. It gives 375 books to students. How many books remain?','1,353','First find 36 × 48 = 1,728 books. Then subtract 375: 1,728 − 375 = 1,353.');
    setExample(L,2,'A number divided by 24 gives quotient 317 and remainder 11. Find the original number.','7,619','Use dividend = divisor × quotient + remainder: 24 × 317 + 11 = 7,608 + 11 = 7,619.');
    const bad=L.practice.findIndex(q=>String(q).includes('31,762'));
    if(bad>=0){L.practice[bad]='Work out (32,824 − 734 × 44) ÷ 44.';L.solutions.practice[bad]='12';}
  }

  L=data.find(x=>x.lesson===30);
  if(L){
    setExample(L,0,'A triangle has side lengths 7 cm, 7 cm and 10 cm. Classify it by its sides.','Isosceles triangle','Two sides are equal, so the triangle is isosceles.');
    setExample(L,1,'A quadrilateral has exactly one pair of parallel sides. Name the shape.','Trapezium','A trapezium has one pair of parallel sides in the Year 7 classification used here.');
    setExample(L,2,'A quadrilateral has four equal sides and four right angles. Name the most specific shape and give two other families it belongs to.','Square; it is also a rectangle and a rhombus.','Four right angles make it a rectangle; four equal sides make it a rhombus. Having both sets of properties makes it a square.');
  }

  L=data.find(x=>x.lesson===38);
  if(L){
    setExample(L,0,'Two parallel lines are cut by a transversal. One angle is 68°. Find the corresponding angle x.','68°','Corresponding angles are equal when the lines are parallel, so x = 68°.');
    setExample(L,1,'Two co-interior angles lie between parallel lines. One is 117°. Find the other.','63°','Co-interior angles sum to 180°: 180° − 117° = 63°.');
    setExample(L,2,'Alternate angles are (5x − 8)° and (3x + 28)°. Find x and the angle size.','x = 18; angle = 82°','Alternate angles are equal: 5x − 8 = 3x + 28. So 2x = 36, x = 18, then 5(18) − 8 = 82°.');
  }

  L=data.find(x=>x.lesson===43);
  if(L){
    setExample(L,0,'A rectangle is 12 cm by 7 cm. Find its perimeter and area.','Perimeter = 38 cm; area = 84 cm²','Perimeter = 2(12 + 7) = 38 cm. Area = 12 × 7 = 84 cm².');
    setExample(L,1,'A trapezium has parallel sides 8 cm and 15 cm and perpendicular height 6 cm. Find its area.','69 cm²','A = ½(a+b)h = ½(8+15)×6 = ½×23×6 = 69 cm².');
    setExample(L,2,'A triangle has area 54 cm² and base 12 cm. Find its perpendicular height.','9 cm','Use A = ½bh. So 54 = ½×12×h = 6h, hence h = 9 cm.');
  }

  L=data.find(x=>x.lesson===52);
  if(L){
    setExample(L,0,'Classify eye colour as categorical or numerical.','Categorical','Eye colour is a label or category, not a numerical measurement.');
    setExample(L,1,'Classify the number of siblings a student has as categorical, discrete numerical or continuous numerical.','Discrete numerical','It is numerical and counted in whole numbers, so it is discrete.');
    setExample(L,2,'A PE teacher records each student’s 100 m time. Is this discrete or continuous data? Explain.','Continuous numerical','Time is measured and can take any value within an interval, so it is continuous.');
  }

  L=data.find(x=>x.lesson===53);
  if(L){
    setExample(L,0,'A Year 7 team wants to estimate average journey time to school. State the variable and a sensible unit.','Journey time, measured in minutes.','Define exactly what is being measured before collecting data. Minutes are precise enough for a school journey survey.');
    setExample(L,1,'There are 240 Year 7 students. Design a fair sampling method to estimate average journey time.','Use a random or stratified sample drawn across the Year 7 classes.','The sample should represent the whole Year 7 population rather than one friendship group or club.');
    setExample(L,2,'A survey asks: “Don’t you agree our lunch break is too short?” Explain the problem and improve the question.','It is leading. A neutral version is: “How long do you think the lunch break should be?”','Avoid wording that suggests the desired answer. Response categories should also be clear and non-overlapping.');
  }

  L=data.find(x=>x.lesson===54);
  if(L){
    setExample(L,0,'The bar chart shows books read: Ali 4, Maya 9, Sara 6 and Omar 11. Who read the most, and how many more books than Ali?','Omar; 7 more books.','Read the bar heights using the vertical scale: 11 − 4 = 7.');
    setExample(L,1,'In a pie chart, 9 of 30 students choose reading. Find the sector angle.','108°','Sector angle = 9/30 × 360° = 108°.');
    setExample(L,2,'A bar chart compares 50 and 52 but its vertical axis starts at 48. Explain why the graph is misleading.','The truncated axis exaggerates a difference of only 2.','The numerical values are close, but starting the axis at 48 makes the bars look dramatically different.');
  }

  L=data.find(x=>x.lesson===55);
  if(L){
    setExample(L,0,'For the data 4, 5, 5, 6, 7, 7, 7, 8, 10, find the median, mode and range.','Median = 7; mode = 7; range = 6.','The values are already ordered. The 5th of 9 values is 7; 7 occurs most often; range = 10 − 4 = 6.');
    setExample(L,1,'The mean of 6 values is 12. Five of the values have total 61. Find the sixth value.','11','Total for all six values = 6 × 12 = 72. Missing value = 72 − 61 = 11.');
    setExample(L,2,'Compare Set A: 4,5,5,6,7 with Set B: 4,5,5,6,30. Which average changes most when the outlier 30 is introduced?','The mean changes most.','Set A mean = 5.4 and median = 5. Set B mean = 10 and median = 5. The outlier pulls the mean strongly but leaves the median unchanged.');
  }

  L=data.find(x=>x.lesson===56);
  if(L){
    setExample(L,0,'Values 1, 2, 3, 4 have frequencies 2, 5, 4, 1. Find the mode and total frequency.','Mode = 2; total frequency = 12.','The largest frequency is 5, attached to value 2. Total frequency = 2 + 5 + 4 + 1 = 12.');
    setExample(L,1,'Using values 1, 2, 3, 4 with frequencies 2, 5, 4, 1, find the mean.','7/3 ≈ 2.33','Σxf = 1×2 + 2×5 + 3×4 + 4×1 = 28. Σf = 12. Mean = 28/12 = 7/3 ≈ 2.33.');
    setExample(L,2,'Values 10, 20 and 30 have frequencies 3, 4 and 3. Find the median and mean.','Median = 20; mean = 20.','There are 10 values, so the median is the mean of the 5th and 6th values; both are 20. Mean = (10×3 + 20×4 + 30×3)/10 = 200/10 = 20.');
  }

  L=data.find(x=>x.lesson===64);
  if(L){
    setExample(L,0,'For y = 2x − 1, complete the values when x = −2, 0 and 3.','y = −5, −1, 5','Substitute each x-value: 2(−2)−1=−5; 2(0)−1=−1; 2(3)−1=5.');
    setExample(L,1,'Does the point (4, 9) lie on the line y = 2x + 1?','Yes.','Substitute x=4: 2×4+1=9, which matches the point’s y-coordinate.');
    setExample(L,2,'The point (x, 13) lies on y = 3x + 1. Find x.','4','13 = 3x + 1, so 12 = 3x and x = 4.');
  }
}
window.NES_V4={apply};
})();