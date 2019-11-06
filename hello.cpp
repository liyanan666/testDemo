#include <iostream>
#include <cstring>

#define MAX 1000

using namespace std;

struct Mail
{
    string name;
    string phone;
    string address;
    string sex;
};

struct MailList
{
    struct Mail mailArrary[MAX];
    int m_size;
};

void addMail(struct MailList *Mail)
{
    cout << "please enter name ";
    cin >> Mail->mailArrary[Mail->m_size].name;
    cout << "please enter phone ";
    cin >> Mail->mailArrary[Mail->m_size].phone;
    cout << "please enter address ";
    cin >> Mail->mailArrary[Mail->m_size].address;
    cout << "please enter sex ";
    cin >> Mail->mailArrary[Mail->m_size].sex;
    cout << "saved";
    Mail->m_size++;
    system("cls");
}

void findMail(struct MailList *Mail)
{
    for (int i = 0; i < Mail->m_size; i++)
    {
        cout << "name " << Mail->mailArrary[i].name + "\t";
        cout << "phone " << Mail->mailArrary[i].phone + "\t";
        cout << "address " << Mail->mailArrary[i].address + "\t";
        cout << "sex " << Mail->mailArrary[i].sex + "\t" << endl;
    }
}

int isExist(struct MailList *Mail, string name)
{
    for (int i = 0; i < Mail->m_size; i++)
    {
        if (Mail->mailArrary[i].name == name)
        {
            return i;
        }
    }
    return -1;
}

void deleteMail(struct MailList *Mail)
{
    cout << "please enter delete name ";
    string name;
    cin >> name;
    int index = isExist(Mail, name);
    if (index == -1)
    {
        cout << "name is not found" << endl;
        return;
    }
    for (int i = index; i < Mail->m_size; i++)
    {
        Mail->mailArrary[i] = Mail->mailArrary[i + 1];
    }
    Mail->m_size--;
    cout << "delete success" << endl;
}

void OperationMail(struct MailList *Mail)
{

    while (true)
    {
        cout << "1.add mail" << endl;
        cout << "2.find mail" << endl;
        cout << "3.delete mail" << endl;

        int number;
        cout << "please enter your choice ";
        cin >> number;

        switch (number)
        {
        case 1:
            addMail(Mail);
            break;
        case 2:
            findMail(Mail);
            break;
        case 3:
            deleteMail(Mail);
            break;

        default:
            return;
            break;
        }
    }
}

int main()
{
    MailList MailList;
    MailList.m_size = 0;

    OperationMail(&MailList);

    system("pause");
    return 0;
}