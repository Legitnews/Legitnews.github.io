from math import factorial

SIN_ONE = 0.8414709848
COS_ONE = 0.5403023058

def nCr(n,r):
    return factorial(n) / factorial(r) / factorial(n-r)

def intCos(n):
    return sum(( (nCr(n, i) * COS_ONE**(n-i) * SIN_ONE**(i) * (-1)**(i/2)) for i in range(0, n+1, 2)))

def intSin(n):
    return sum(( (nCr(n, i) * COS_ONE**(n-i) * SIN_ONE**(i) * (-1)**((i+1)/2)) for i in range(1, n+1, 2)))
