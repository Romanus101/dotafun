#include <windows.h>
#include <random>
#include <iostream>

// Функция обратного вызова для сворачивания всех окон
BOOL CALLBACK MinimizeAllWindows(HWND hwnd, LPARAM lParam) {
    // Проверяем, что окно видимое и его можно свернуть
    if (IsWindowVisible(hwnd) && !(GetWindowLong(hwnd, GWL_STYLE) & WS_DISABLED)) {
        ShowWindow(hwnd, SW_MINIMIZE);  // Сворачиваем окно
    }
    return TRUE;  // Продолжаем перечисление окон
}

void MinimizeAllVisibleWindows() {
    EnumWindows(MinimizeAllWindows, 0);  // Сворачиваем все окна
}

int DisplayResourceNAMessageBox() {
    // Сворачиваем все окна перед выводом сообщения
    MinimizeAllVisibleWindows();

    // Выводим окно сообщения поверх всех окон
    int msgboxID = MessageBox(
        NULL,
        (LPCWSTR)L"Attention, stretch out, do an eye workout and straighten your back",
        (LPCWSTR)L"Important information",
        MB_ICONWARNING | MB_CANCELTRYCONTINUE | MB_DEFBUTTON2 | MB_TOPMOST // Устанавливаем поверх всех окон
    );

    // Обработка ответа пользователя
    switch (msgboxID) {
    case IDCANCEL:
        // TODO: добавить код, если нужно
        break;
    case IDTRYAGAIN:
        DisplayResourceNAMessageBox();
        break;
    case IDCONTINUE:
        DisplayResourceNAMessageBox();
        break;
    }

    return msgboxID;
}

int main() {
    std::cout << "Program is working. Start playing" << std::endl;
    std::default_random_engine generator;
    std::uniform_int_distribution<int> distribution(1, 12);

    // Цикл с уведомлениями
    for (int i = 0; i < 100000; i++) {
        int n = distribution(generator);
        Sleep(n * 1500);  // Задержка

        // Показываем окно уведомления
        DisplayResourceNAMessageBox();
    }

    std::cout << "Program is stopped. Restart if you need." << std::endl;
    return 0;
}