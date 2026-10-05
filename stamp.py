#!/usr/bin/env python3
"""Stamp index.html's stylesheet and script links with a fresh version number.

Browsers and GitHub's servers keep copies of css/ and js/ files for several
minutes. Changing the ?v= number on each link makes them fetch the new files
as soon as a new index.html is live. Run this before every commit.
"""
import re, time
v = time.strftime('%Y%m%d%H%M%S', time.gmtime())
s = open('index.html').read()
s, n = re.subn(r'((?:href|src)="(?:css|js)/[^"?]+)(?:\?v=\d+)?"', r'\1?v=' + v + '"', s)
open('index.html', 'w').write(s)
print('stamped', n, 'links with v=' + v)
