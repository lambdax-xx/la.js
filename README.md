# la.js

一个线性代数库。

在前端，可以通过函数*lalib*得到这个库，目前本库没有配置设置，所以调用lalib时不用指定参数。例如：
``` JavaScript
var la = lalib();
```

除了在前端使用，本库也可以在放在服务器端。例如：
``` JavaScript
var la = require('.\la.js');
```

## 排列

函数*perm*对给定数组中的m个元素进行怕列，每迭代一次对数组进行一次排列，并返回当前排列的交换次数。例如：

``` JavaScrpt
var array =  [1, 2, 3, 4, 5, 6];
for (var swaps of la.perm(array, 3))
    console.log('' + swaps + ':' + array);
```
如果不指定元素个数m，就会对整个数组进行全排列。例如：
``` JavaScrpt
var array =  [1, 2, 3, 4, 5, 6];
for (var swaps of perm(array))
    console.log('' + swaps + ':' + array);
```

函数*permute*对给定序列中的m个元素进行怕列，每迭代一次对数组进行一次排列，并返回当前排列的元素数组和交换次数。例如：

``` JavaScrpt
for (var p of la.permute(la.range(1, 7), 3))
    console.log('' + p.swaps + ':' + p.array);
```

## 矩阵

本库直接使用以数组为元素的数组作为矩阵。例如：
``` JavaScript
// 2 x 3 矩阵
var matrix = [[2, 1, 0],
              [1, 3, 5]];
// 3阶单位矩阵
var id3 = [[1, 0, 0],
           [0, 1, 0],
           [0, 0, 1]];
```
由于JavaScrpt数组的下标是从0开始的，所以库矩阵的行号和列号是从0开始的，这和R语言从1开始，有稍微的区别。

函数*rows*和*cols*分别得到向量的行数和列数。矩阵中的行向量可以长度不一样，以最长的行向量为列数。

## 行列式

函数*det*计算方阵的行列式。例如：
``` JavaScript
var det = la.det([[1, 0, 3],
                [2, 1, 2],
                [0, 5, 1]]);
```

## 余子式的矩阵

函数*cof*用于得到从矩阵中去掉第i行第j列后的余子式的矩阵。例如：

``` JavaScript
var cof = la.cof([[1, 0, 3],
                  [2, 1, 2],
                  [0, 5, 1]], 1, 1);
```

## 伴随阵

函数*adj*用于得到方阵的伴随阵。例如：

``` JavaScript
var adj = la.adj([[1, 0, 3],
                  [2, 1, 2],
                  [0, 5, 1]]);
```

## 逆阵

函数*inv*用于得到方阵的逆阵，如果没有逆阵则返回undefined。例如：

``` JavaScript
var inv = la.inv([[1, 0, 3],
                  [2, 1, 2],
                  [0, 5, 1]]);
```

## 秩

函数*r*用于得到矩阵的秩。例如：
``` JavaScript
var rank = la.r([[1, 0, 3],
                 [2, 1, 2]]);
```

函数*rank*用于得到矩阵的秩，以及该秩对应的一个方阵。例如：
``` JavaScript
var {rank, matrix} = la.rank([[1, 0, 3],
                              [2, 1, 2]]);
```

## 转置

函数*t*用于得到矩阵的转置。例如：
``` JavaScript
var t = ls.t([[1, 0, 3],
              [2, 1, 2]]);
```

## 向量和矩阵乘法

函数*dmul*求两个向量的点乘。例如：
``` JavaScript
function isOrthogonal(a, b) {
    return dmul(a, b) === 0;
}
```

函数*mmul*计算两个矩阵的乘积。例如：
``` JavaScript
var m = la.mmul([[1, 0, 1],
                 [2, 0, 2]],
                [[2, 0],
                 [1, 1],
                 [0, 1]]);
```

## 向量和矩阵的运算

函数*vmap*和*mmap*分别对向量和矩阵中的元素进行处理后得到一个同样尺寸的向量和矩阵。
``` JavaScript
function nvmul(number, vector) {
    return la.vmap(e => e * number)(vector);
}

function nmmul(number, matrix) {
    return la.mmap(e => e * number)(matrix);
}
```


## 后序

随着JavaScript2015的出台，Js在也不是只能用于事务处理的语言。也许我们可以使用它干一些计算的活，特别实在前端，这里我们不方便得到R语言的帮助。

另外，在大学的线性代数的教学中，后期适当引入计算机的实现更有助于加深学生的理解。

