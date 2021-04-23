/*

Queue.js

A function to represent a queue

Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
* items are added to the end of the queue and removed from the front.
*/
function Queue(){

  var queue  = [];
  var offset = 0;

  this.getLength = function(){
    return (queue.length - offset);
  }

  this.isEmpty = function(){
    return (queue.length == 0);
  }


  this.push_back = function(item){
    queue.push(item);
  }
  this.push_front = function(item){
    queue.unshift(item);
  }

  this.pop_front = function(item){
    return queue.shift(item);
  }


}

function rotation(Px, Py, Cx, Cy, theta) {
  var delta_x = Px - Cx;
  var delta_y = Py - Cy;
  var C = Math.cos(theta);
  var S = Math.sin(theta);
  var new_delta_x = C * delta_x - S * delta_y;
  var new_delta_y = S * delta_x + C * delta_y;
  return [Cx + new_delta_x, Cy + new_delta_y];
}

function vect(src_x, src_y, dst_x, dst_y) {
  var x = dst_x - src_x;
  var y = dst_y - src_y;
  return [x, y];
}

function produit_scalaire(Ax, Ay, Bx, By) {
  return Ax * Bx + Ay * By;
}

function norm(x, y) {
  return Math.sqrt(produit_scalaire(x, y, x, y));
}

function dist(src_x, src_y, dst_x, dst_y) {
  var l = vect(src_x, src_y, dst_x, dst_y);
  var x = l[0];
  var y = l[1];
  return norm(l[0], l[1]);
}

function norm_square(x, y) {
  return produit_scalaire(x, y, x, y);
}

function dist_square(src_x, src_y, dst_x, dst_y) {
  var l = vect(src_x, src_y, dst_x, dst_y);
  var x = l[0];
  var y = l[1];
  return norm_square(x, y);
}

function milieu(Ax, Ay, Bx, By) {
  var x = (Ax + Bx) / 2;
  var y = (Ay + By) / 2;
  return [x, y];
}

function vect_orthogonal_centrifuge(Ax, Ay, Bx, By, Ox, Oy) {
  var l = vect(Ax, Ay, Bx, By);
  var x = l[0];
  var y = l[1];
  var l = milieu(Ax, Ay, Bx, By);
  var Mx = l[0];
  var My = l[1];
  if (y * (Mx - Oy) == x * (My - Ox))
  return [y, -x];
  var s = (y * (Mx - Oy) - x * (My - Ox)) / Math.abs(y * (Mx - Oy) - x * (My - Ox));
  return [s * y, - s * x];
}

function get_orthogonal_circle_radius_and_center(Ax, Ay, Bx, By, Ox, Oy, R) {
  var AB = dist(Ax, Ay, Bx, By);
  var ApBx = Ax + Bx;
  var ApBy = Ay + By;
  var AmBx = Ax - Bx;
  var AmBy = Ay - By;
  var norm_ApB = norm(ApBx, ApBy);
  var norm_AmB = norm(AmBx, AmBy);
  var l = vect_orthogonal_centrifuge(Ax, Ay, Bx, By, Ox, Oy);
  var wx = l[0];
  var wy = l[1];
  var ps = produit_scalaire(ApBx, ApBy, wx, wy);
  var ret = {};
  ret.r = AB * Math.sqrt(1/4 + ((R**2 - 1/4*(norm_ApB**2 - norm_AmB**2)) / ps)**2);
  ret.Cx = ApBx / 2 + Math.sqrt((ret.r/AB)**2 - 1/4) * wx;
  ret.Cy = ApBy / 2 + Math.sqrt((ret.r/AB)**2 - 1/4) * wy;
  return ret;
}

function circle_inversion(Px, Py, Cx, Cy, r) {
  var l = vect(Cx, Cy, Px, Py);
  var x = l[0];
  var y = l[1];
  var new_norm = r*r / (x*x + y*y);
  return [Cx + new_norm * x, Cy + new_norm * y];
}

function circle_inversion_polygon(bounds, Cx, Cy, r) {
  var size = bounds.length;
  var res_bounds = [];
  for (var i = 0; i < size/2; i++) {
    var l = circle_inversion(bounds[i*2], bounds[i*2+1], Cx, Cy, r)
    var x = l[0];
    var y = l[1];
    res_bounds.push(x, y);
  }
  return res_bounds;
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1)
  arr.splice(index, 1);
  return arr;
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function PoincareTilingPoint(a, b, c) {
  var p = {};
  p.x = a;
  p.y = b;
  p.adjacentTilesNum = c;
  return p;
}

function is_same_point(p_1, p_2) {
  //console.log(p_1.x, p_1.y, p_2.x, p_2.y);
  var d = dist_square(p_1.x, p_1.y, p_2.x, p_2.y);
  //console.log(d);
  return d < Math.pow(10, -10);
}

function arrContains(arr, p) {
  for (var p2 of arr) {
    if (is_same_point(p, p2)) {
      return true;
    }
  }
  return false;
}

function arrGetValue(arr, p) {
  for (var p2 of arr) {
    if (is_same_point(p, p2))
    return p2.adjacentTilesNum;
  }
  return undefined;
}

function arrSetValue(arr, p, val) {
  for (var p2 of arr) {
    if (is_same_point(p, p2)) {
      var idx = arr.indexOf(p2);
      p2.adjacentTilesNum = val;
      arr[idx] = p2;
      return val;
    }
  }
}

function arrAdd(arr, p, val) {
  if (arrContains(arr, p)) {
    return arrSetValue(arr, p, val);
  } else {
    p.adjacentTilesNum = val;
    arr.push(p);
    return val;
  }
}

function arrIncr(arr, p) {
  if (arrContains(arr, p)) {
    //console.log("yes");
    return arrSetValue(arr, p, arrGetValue(arr, p) + 1);
  } else {
    //console.log("no");
    return arrAdd(arr, p, 1);
  }
}

function arrDelete(arr, p) {
  for (var p2 of arr) {
    if (is_same_point(p, p2)) {
      removeItemOnce(arr, p2);
      return;
    }
  }
}

function make_hyperbol2tiling(p, q, star, iter_num, Ox, Oy, R) {
  var tiles = [];
  var tiles_queue = new Queue();
  var dict = [];
  var id = 0;

  // Verification des parametres
  if (1/p + 1/q >= 1/2) {
    console.log("Error: p and q must respect hyperbolic angular rule.");
    return;
  }

  // Initialisation
  var beta_2 = 2 * Math.PI / q;
  var alpha_1 = Math.PI / p;
  var gamma_1 = Math.PI / 2 - alpha_1;
  var OA = Math.sqrt(R * (R + Math.sin(beta_2 / 2)**2 / (Math.sin(gamma_1)**2 - Math.sin(beta_2 / 2)**2))) * Math.cos(beta_2 / 2) - R * Math.sin(beta_2 / 2) * Math.cos(gamma_1) / Math.sqrt(Math.sin(gamma_1)**2 - Math.sin(beta_2 / 2)**2);
  //console.log("OA:", OA);
  var Ax = OA;
  var Ay = 0;

  // Creation des tuiles de base
  if (!star) {
    var bounds = [];
    bounds.push(Ax, Ay);
    for (var i = 1; i < q; i++) {
      var l = rotation(Ax, Ay, Ox, Oy, i*beta_2);
      bounds.push(l[0], l[1]);
    }
    //console.log(bounds);
    var neighbour_by_side = [];
    for (var k = 0; k < bounds.length / 2; k++) {
      neighbour_by_side.push(undefined);
      var point = PoincareTilingPoint(bounds[k*2], bounds[k*2+1], 0);
      arrIncr(dict, point);
    }
    //console.log(dict);
    var tile = new Tile([0, 0], [], bounds, q);
    tile.neighbour_by_side = neighbour_by_side;
    tiles.push(tile);
    for (var side = 0 ; side < q; q++){
      tiles_queue.push_back([tile,side,p-2,1]);

    }
  }
  while ( !tiles_queue.isEmpty())
  {

    var tile ;
    var side_no;
    var cpt;
    var iter ;
    [tile,side_no,cpt,iter] = tiles_queue.pop_front();


    var side_num = tile.bounds.length / 2;

    var ret = get_orthogonal_circle_radius_and_center(
      tile.bounds[(2*side_no+0)%(side_num*2)],
      tile.bounds[(2*side_no+1)%(side_num*2)],
      tile.bounds[(2*side_no+2)%(side_num*2)],
      tile.bounds[(2*side_no+3)%(side_num*2)],
      Ox, Oy, R);
      var T_2_bounds = circle_inversion_polygon(tile.bounds, ret.Cx, ret.Cy, ret.r);
      var T_2 = new Tile([id], [], T_2_bounds, q);
      id = id+1;
      tiles.push(T_2);
      if (cpt > 0){
        tiles_queue.push_back(T_2, q-2 ,cpt-1 ,iter);
      }
      tiles_queue.push_front(T_2);
      if (iter < iter_num){
        tiles_queue.push_back(T_2, 2 ,p-2 ,iter+1);
      }


    }
    console.log(dict);


    return tiles;
  }

  Tiling.hyperbol2Tiling = function({iterations}={}) {
    var R = 1;
    var Ox = 0;
    var Oy = 0;
    var p = 3; // pour angle tangent
    var q = 7; // pour angle ouverture centrale
    var iter_num = iterations;
    return new Tiling(make_hyperbol2tiling(p, q, false, iter_num, Ox, Oy, R));
  };
