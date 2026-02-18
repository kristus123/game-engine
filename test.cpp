// hello.cpp
#include <iostream>

extern "C" int add(int a, int b) {
    return a + b;
}

int main() {
    std::cout << "3 + 4 = " << add(3, 4) << "\n";
    return 0;
}

