#include <iostream>
#include <vector>
#include <string>
#include <set>
#include <unordered_map>
#include <fstream>
#include <sstream>
#include <regex>
using namespace std;

struct course{
    string code, name, instructor, credit, section;
    bool hasLab;
    struct time{
        string start, end, days;

        time(string start, string end, string days)
        :start(start), end(end), days(days) {}
    };
    vector<time>times;

    course(string code, string name, string instructor, string start, string end, string days, string credit, string section){
        this->code = code;
        this->name = name;
        this->instructor = instructor;
        this->credit = credit;
        this->section = section;
        times.push_back(time(start, end, days));
        hasLab = false;
    }

    void addLab(course& c){
        hasLab = true;
        times.push_back(time(
            c.times[0].start, c.times[0].end, c.times[0].days
        ));
    }

    string getJson(){
        string hasLabAlpha = hasLab ? "true": "false";
        auto getJsonKeyPair = [](string key, string value)->string{
            return "\"" + key + "\": \"" + value + "\"";
        };
        auto getJsArrays = [](vector<time>&times)->string{
            string str = "[";
            for(auto& time: times){
                str += "[\"" + time.start + "\", \"" + time.end + "\", \"" + time.days + "\" ],";
            }
            str.pop_back();
            str += "]";
            return str;
        };
        string json = "{\n";
        json += getJsonKeyPair("code",code) + ",\n";
        json += getJsonKeyPair("name",name) + ",\n";
        json += getJsonKeyPair("section",section) + ",\n";
        json += getJsonKeyPair("credit",credit) + ",\n";
        json += getJsonKeyPair("instructor",instructor) + ",\n";
        json += "\"times\": " + getJsArrays(times) + ",\n";
        json += "\"hasLab\": " + hasLabAlpha;
        return json + "}";
    }
};
bool isCourseCode(vector<string>&words, int idx){
    string line = words[idx] + words[idx+1];
    regex code("[A-Z]{2,4}?[0-9]{3,4}?[A-Z]?");
    return regex_match(line, code);
}

bool isTime(string& str){
    regex time("[0-9]{1,2}?:[0-9]{2}?[AP]M");
    return regex_match(str, time);
}

bool isWeekDay(string& str){
    regex day("(.*)[MTWRFSU]{1,7}?(.*)");
    return regex_match(str, day);
}

bool isCredit(string& str){
    if(str == "0.5" || str == "1.5") return true;
    try {
        int i = stod(str);
        return true;
    } catch (...) {}
    return false;
}

int findEntity(vector<string> &vec, bool(*func)(string&), int startIdx){
    for(int i = startIdx; i < vec.size(); ++i){
        if(func(vec[i])){
            return i;
        }
    }
    cout << "findEntity Error\n{ ";
    cout << "startIdx: " << startIdx << ",  ";
    cout << "size: " << vec.size() << ", ";
    cout << "code: " << vec[0] + vec [1] << " }\n";
    return 0;
}

string join(vector<string>&vec, int start, int end = 0){
    if(end == 0){
        end = vec.size() - 1;
    }
    string joined = "";
    for(int i = start; i <= end; ++i){
        joined += (vec[i] + ' ');
    }
    joined.pop_back();
    return joined;
}

pair<string, string> resolveKey(string str) {
    int pos = str.find('|');
    string code = str.substr(0,pos);
    string section = str.substr(pos+1);
    return make_pair(code, section);
}

string getLectureCode(string str){
    auto [code, section] = resolveKey(str);
    return code + "|LEC" + section.substr(3);
}

int main() {
    fstream file("./rawText.txt", ios::in);
    vector<string>words;
    set<int>startIdx;
    string word = "";
    word.reserve(70000);

    while(file >> word){
        words.push_back(word);
    }

    for(int i = 0; i + 1 < words.size() ; ++i){
        bool isCode = isCourseCode(words, i);
        if(isCode)
            startIdx.insert(i);
    }

    vector<string>lines = {""};
    int lineIdx = 0;
    lines.reserve(500);
    for(int i = 0; i<words.size(); ++i){
        string word = words[i] + ' ';
        if(startIdx.find(i) != startIdx.end()){
            lineIdx++;
            lines.push_back("");
        }
        lines[lineIdx] += word;
    }

    vector<string>properLines;
    properLines.reserve(lines.size());
    for(string s: lines){
        int slen = s.size();
        if((slen > 20) && s.substr(slen - 3) != "w/ " ) {
            properLines.push_back(s);
        }
    }

    // fstream target("target.txt", ios::out);
    // for(string s: properLines){
    //     target << s << '\n';
    //     cout << s;
    // }
    // cout << "Written\n";
    // target.close();
    
    unordered_map<string, course*>courses;
    courses.reserve(properLines.size());
    for(string line: properLines){

        vector<string>entities;
        entities.reserve(30);
        stringstream ss(line);
        string entity;
        while(ss >> entity)
            entities.push_back(entity);
        
        try {
            int creditIdx = findEntity(entities, isCredit, 3);
            int daysIdx = findEntity(entities, isWeekDay, creditIdx);
            int startIdx = findEntity(entities, isTime, daysIdx);

            string start = entities[startIdx]; 
            string end = entities[startIdx + 1]; 
            string credit = entities[creditIdx]; 
            string days = entities[daysIdx];

            string code = join(entities, 0, 1);
            string name = join(entities, 2, creditIdx - 1); 
            string instructor = join(entities, startIdx + 2); 
            string section = join(entities, creditIdx + 1, creditIdx + 2);

            courses[code + '|' + section] = new course(
                code, name, instructor, start, end, days, credit, section
            );

        } catch (...) {
            cout << "access error at " + line + '\n';
        }
    }

    for(auto& itr: courses){
        string section = itr.second->section.substr(0,3);
        if(section == "LAB" || section == "RAC"){
            string lectureCode = getLectureCode(itr.first); 
            if(courses.find(lectureCode) != courses.end()){
                courses[lectureCode]->addLab(*itr.second);
            }
        }
    }

    fstream jsonFile("coursesApi.json", ios::out);
    jsonFile << "[\n\n";
    for(auto &itr: courses){
        string section = itr.second->section.substr(0,3);
        if(!(section == "LAB" || section == "RAC")){
            jsonFile << itr.second->getJson() + ",\n";
        }
        delete itr.second;
    }
    jsonFile << "\n]";
    jsonFile.close();
    return 0;
}



