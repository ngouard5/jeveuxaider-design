import sys
from html.parser import HTMLParser

VOID = {"area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"}

class Checker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            return
        self.stack.append((tag, self.getpos()))
    def handle_endtag(self, tag):
        if not self.stack:
            self.errors.append(f"extra closing </{tag}> at {self.getpos()}")
            return
        top, pos = self.stack[-1]
        if top == tag:
            self.stack.pop()
        else:
            found = False
            for i in range(len(self.stack)-1, -1, -1):
                if self.stack[i][0] == tag:
                    found = True
                    break
            if found:
                self.errors.append(f"mismatched close </{tag}> at {self.getpos()}, expected </{top}> opened at {pos}")
                del self.stack[i:]
            else:
                self.errors.append(f"stray closing </{tag}> at {self.getpos()} with no matching open")

for path in sys.argv[1:]:
    with open(path, encoding="utf-8") as f:
        content = f.read()
    c = Checker()
    c.feed(content)
    if c.errors or c.stack:
        print(f"=== {path} ===")
        for e in c.errors:
            print(" ERROR:", e)
        if c.stack:
            print(" UNCLOSED:", [f"{t} at {p}" for t,p in c.stack])
print("checked", len(sys.argv[1:]), "files")
