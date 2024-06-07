import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved }
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

 const firebaseConfig = {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app); //RealtimeDBに接続
    const dbRef = ref(db, "chat"); //RealtimeDB内の"chat"を使う

    //データ登録(Click)
    $("#send").on("click", function () {
        const choice = $('#choice').val();
        const text = $("#text").val();

        console.log(choice,'送信者')
        console.log(text,'テキスト')

        if(text.trim() === ""){
            alert("メッセージを入力してください");
            return;
        }

        const msg = {
            choice: $("#choice").val(),
            text: $("#text").val(),
            timestamp: Date.now()
        };

        const newPostRef = push(dbRef);
        set(newPostRef, msg).then(() => {
            $("#text").val("");
        }).catch((error) => {
            console.error("Error sending message: ", error);
        });
    });

    //データ登録(Enter)
    $("#text").on("keydown", function (e) {
        console.log(e);        //e変数の中身を確認！！
            if (e.keyCode == 13 && !e.shiftKey) {   //EnterKey=13
                e.preventDefault();
                const choice = $('#choice').val();
                const text = $('#text').val();

                if (text.trim() === ""){
                    alert("メッセージを入力してください");
                    return;
                }

                const msg = {
                   choice: $("#choice").val(),
                   text: $("#text").val(),
                   timestamp: Date.now()
                };

        const newPostRef = push(dbRef);
        set(newPostRef, msg).then(() => {
            $("#text").val("");
        }).catch((error) => {
            console.error("Error sending message: ", error);
        });
    }
});

const messageLimits = {
    cheeter: 5,
    deer: 5,
    rabit: 5
};

const messageCounts = {
    cheeter: [],
    deer: [],
    rabit: []
};

    //最初にデータ取得＆onSnapshotでリアルタイムにデータを取得
    onChildAdded(dbRef, function (data) {
        const msg = data.val();
        const key = data.key;
        const date = new Date(msg.timestamp);
        const formattedTime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;


        let h = `<p>${msg.text} <br> <span class="timestamp">${formattedTime}</span></p>`;

        switch (msg.choice) {
            case "cheeter":
                  $("#cheeter_msg").append(h);
                  messageCounts.cheeter.push(key);
                  if (messageCounts.cheeter.length > messageLimits.cheeter){
                     const oldestKey = messageCounts.cheeter.shift();
                     $(`#cheeter_msg p:first`).remove();
                     remove(ref(db, `chat/${oldestKey}`));
            }
            break;
            case "deer":
                  $("#deer_msg").append(h);
                  messageCounts.deer.push(key);
                  if (messageCounts.deer.length > messageLimits.deer){
                     const oldestKey = messageCounts.deer.shift();
                     $(`#deer_msg p:first`).remove();
                     remove(ref(db, `chat/${oldestKey}`));
            }
            break;
            case "rabit":
                $("#rabit_msg").append(h);
                messageCounts.rabit.push(key);
                if (messageCounts.rabit.length > messageLimits.rabit){
                   const oldestKey = messageCounts.rabit.shift();
                   $(`#rabit_msg p:first`).remove();
                   remove(ref(db, `chat/${oldestKey}`));
            }
            break;
        default:
            $("#output").append(h);
            break; 
        }
    });

