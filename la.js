/* Linear algebra library */

function lalib() {

return {
	minin : mixin,
	template : template,

	perm : perm,
	permute : permute,
	range : range,

	dmul : dmul,
	veq : veq,
	vmap : vmap,

	rows : rows,
	cols : cols,
	mmul : mmul,
	meq : meq,
	mmap : mmap,
	det : det,
	t : t,
	cof : cof,
	adj : adj,
	inv : inv,
	r : r,
	rank : rank
};

/* Misc */

// Mixes proto in the prototype links of obj.
function mixin(obj, proto) {
	Object.setPrototypeOf(proto, Object.getPrototypeOf(obj));
	Object.setPrototypeOf(obj, proto);
}

// Generates a simple template for rendering html.
// <%= expression %>
// <% code %>
function template(ts) {
	var rg = /<%([\s\S]*?)%>/g;

	var code = '_result = ""; \r\n with(_data) { \r\n';
	var index = 0;
	var p = rg.exec(ts);

	do { 
        var idx = rg.lastIndex - p[0].length;
		if (idx !== index)
			code += '_result += `' +  ts.substring(index, idx) + '`;\r\n';
		index = rg.lastIndex;

		if (p[1][0] === '=') {
			code += '_result += ' + p[1].substr(1) + ';\r\n';
		} else {
			code += p[1];
		}

		p = rg.exec(ts);
	} while(p);

	if (index < ts.length )
		code += '_result += `' +  ts.substr(index) + '`;\r\n';
	
	code += "} \r\n return _result;";

	return new Function('_data', code);
}

/* Permute */

// Permutes the m elements of an array, and return the swap times of each permuting.
function* perm(array, m) {
	var _swap = function(array, k, i) {
		var temp = array[i];
		array[i] = array[k];
		array[k] = temp;
	}
	var _perm = function* (array, swaps, k, m) {
		if (k >= m) {
			yield swaps;
		} else {
			for (var i = k; i < array.length; i++) {
				_swap(array, k, i);
				yield* _perm(array, swaps + (k === i ? 0 : 1), k + 1, m);
				_swap(array, k, i);
			}
		}
	}

	m = m || array.length;
	if (m > array.length)
		m = array.length;

	yield* _perm(array, 0, 0, m);
}

// Permutes the m elements of a list, and return both the swap times and permutation array of each permuting.
function* permute(list, m) {
	var _swap = function(array, k, i) {
		var temp = array[i];
		array[i] = array[k];
		array[k] = temp;
	}
	var _perm = function* (array, swaps, k, m) {
		if (k >= m) {
			yield {swaps: swaps, array: array};
		} else {
			for (var i = k; i < array.length; i++) {
				_swap(array, k, i);
				yield* _perm(array, swaps + (k === i ? 0 : 1), k + 1, m);
				_swap(array, k, i);
			}
		}
	}

	var array = new Array();
	for (var e of list)
		array.push(e);

	m = m || array.length;
	if (m > array.length)
		m = array.length;

	yield* _perm(array, 0, 0, m);
}

// Returns a number sequences from start to end by step(not incldue end).
function* range(start, end, step) {
	if (end === undefined)
		end = Number.MAX_SAFE_INTEGER;
	step = step || 1;
	if (start < end) {
		for (var i = start; i < end; i += step)
			yield i;
	} else {
		for (var i = start; i > end; i -= step)
			yield i;
	} 
}

/* Vector */

// Dot multiplication of two vectors.
function dmul(a, b) {
	var length = a.length < b.length ?  a.length : b.length;
	var r = 0;
	for (var i = 0; i < a.length; i ++) {
		r += a[i] * b[i];
	}
	return r;
}

// Checkes weither two vectors is equal.
function veq(a, b) {
	if (a.length != b.length)
		return false;

	for (var i = 0; i < a.length; i++) {
		if (a[i] != b[i])
			return false;
	}

	return true;
}

// Maps a vector to another.
function vmap(f) {
	return function(vector) {
		return vector.map(f);
	}
}


/* Matrix */

// Gets the rows numbers of a matrix.
function rows(matrix) {
	return matrix.length;
}

// Gets the columns number of a matrix.
function cols(matrix) {
	var cs = 0;
	for (var row of matrix) {
		if (cs < row.length)
			cs = row.length;
	}
	return cs;
}

// Multiplies two matrix.
function mmul(a, b) {
	b = t(b);

	var m = [];
	for (var row of a) {
		var r = [];
		for (var col of b) {
			r.push(dmul(row, col));
		}
		m.push(r);
	}

	return m;
}

// Checkes weither two matrix is equal.
function meq(a, b) {
	if (a.length !== b.length)
		return false;

	for (var i = 0; i < a.length; i++) {
		if (!veq(a[i], b[i]))
			return false;
	}

	return true;
}

// Maps a matrix to another.
function mmap(f) {
	return function (matrix) {
		var m = [];
		for (var row of matrix) {
			m.push(row.map(f));
		}
		return m;
	}
}

// Calculates the determinant of a square matrix.
function det(matrix) {
	var n = matrix.length;

	var dd, d = 0;
	for(var p of permute(range(0, n))) {
		dd = (p.swaps % 2 === 0) ? 1 : -1;
		for (var i = 0; i < n; i++)
			dd *= matrix[i][p.array[i]];
		d += dd;
	}

	return d;
}

// Gets the transport matrix.
function t(matrix) {
	var tm = [];
	
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[i].length; j++) {
			while (tm.length <= j)
				tm.push([]);

			while(tm[j].length < i)
				tm[j].push(undefined);

			tm[j].push(matrix[i][j]);
		}
	}

	return tm;
}

// Gets the cofactor matrix of element (i, j) of a matrix. 
function cof(matrix, i, j) {
	var m = Array.from(matrix);
	m.splice(i, 1);
	for (var row of m) {
		row.splice(j, 1);
	}
	return m;
}

// Calculates the adjoint matrix.
function adj(matrix) {
	var rs = rows(matrix);
	var cs = cols(matrix);

	var am = [];
	for (var i = 0; i < rs; i++) {
		var r =[];
		for (var j = 0; j < cs; j++) {
			var d = det(cof(matrix, i, j));
			r.push((i + j) % 2 === 0 ? d : -d);
		}
		am.push(r);
	}

	return am;
}

// Calculates the inverse matrix, if is existed, return it, otherwise, return undefined.
function inv(matrix) {
	var d = det(matrix);
	if (d !== 0)
		return mmap(e => e * d)(adj(matrix));
}

// Calculates the rank of matrix.
function r(matrix) {
	return rank(matrix).rank;
}

// Calculates the rank of matrix, with returns the sub matrix.
function rank(matrix) {
	var rs = rows(matrix);
	var cs = cols(matrix);
	var n = rs < cs ? rs : cs;
	
	for (var r = n; r > 0; r--) {
		for(var rp of permute(range(0, r))) {
			for (var cp of permute(range(0, r))) {
				var m = [];
				for (var i = 0; i < rp.array.length; i++) {
					var r = [];
					for (var j = 0; j < cp.array.length; j++) {
						r.push(matrix[rp.array[i]][cp.array[j]]);
					}
					m.push(r);
				}
				var d = det(m);
				if (d !== 0)
					return {rank: r, matrix: m};
			}
		}
	}

	return {rank: 0, matrix: []};
}



}

/* for Node.js */
if (exports) {
	module.exports = lalib();
}

/* test */
function test() {
	var la = lalib();

	function check(testcase) {
		if (!testcase()) {
			console.warn(testcase.toString());
		}
	}

	check((/*mmul*/) => la.meq(la.mmul(
		[[1, 0, 1],
		 [2, 0, 2]],
		[[2, 0],
		 [1, 1],
		 [0, 1]]),
		[[2, 1],
		 [4, 2]]));

}

test();

