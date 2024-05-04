
#include <random>
#include <iostream>
#include <Windows.h>

int main()
{
    std::cout << "Program is working. Start playing";
    char arr[12] = {
        'Q','W','E','R','Z','X','C','F','D','V','B','N'
    };
    std::default_random_engine generator;
    std::uniform_int_distribution<int> distribution(1, 12);
    for(int i = 0;i<100000;i++){
    int n = distribution(generator);
    Sleep(n * 1000);
    keybd_event(arr[n], 0, 0, 0);
    keybd_event(arr[n], 0, KEYEVENTF_KEYUP, 0);
    }
    std::cout << "Program is stopped.Restart if you need";
}
