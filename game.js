m = Math, R = m.random, P = m.pow, D = c.width = c.height = 600, t = 12, T = D - t, O = 256, l = e = E = N = 0;

setInterval(function() {
	if (!E && (e >= N || (L && e < N && l--))) {
		e = L = 0;
		Z = ++l * 5;
		A = [];
		N = l * (l + 1) / 2;
	}
	a.fillStyle = e < N ? '#a41' : '#c73';
	a.fillRect(0, 0, D, D);
	a.strokeText(e + '/' + N, 9, 9);

	i = Z;
	while (i--) {
		with (A[i] || (A[i] = {
			s : L,
			M : R() * 40 + 20,
			x : L ? L.clientX : R() * T + 6,
			y : L ? L.clientY : R() * T + 6,
			v : R() * t - 6,
			z : R() * t - 6,
			C : 'rgb(' + [R() * O | 0, R() * O | 0, R() * O | 0] + ')',
			r : 6,
			t : 30 / l | 0
		})) {
			if (!s) {
				A.some(function(o) {
					return o.s && P(r + o.r, 2) > P(x - o.x, 2) + P(y - o.y, 2) && (s = 1, E++, e++);
				});
				x += v *= 1 - 2 * (x < r | x+r > D);
				y += z *= 1 - 2 * (y < r | y+r > D);
			} else if (!t) {
				if (!--r) {
					A.splice(i, 1);
					Z--;
					E--;
				}
			} else if (s > 1) {
				t--;
			} else {
				if (++r > M) {
					s = 2;
				}
			}

			a.beginPath();
			a.fillStyle = C;
			a.arc(x, y, r, 0, 7);
			a.fill();
		}};
}, 50);

c.onclick = function(e) {
	L || (L = e, E++, Z++);
};
