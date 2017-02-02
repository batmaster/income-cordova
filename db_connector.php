<?php
    mysql_connect("localhost","root","rootaemysql") or die("ไม่สามารถเชื่อมต่อฐานข้อมูลได้");
    mysql_select_db("income_cordova") or die(mysql_error());
    mysql_query("SET NAMES utf8");

    // header('Access-Control-Allow-Origin: *');

    function sql($sql) {
        $result = mysql_query($sql) or die($sql . "\n" . mysql_error());

        logs($sql);

        if ($result != undefined) {
            $rows = array();
            while ($r = mysql_fetch_assoc($result)) {
                // $rows[] = array_merge(array("i" => $number++), $r);
                $rows[] = $r;
            }

            if (count($rows) == 1) {
                return $rows[0];
            }

            return $rows;
        }
    }

    function logs($str) {
        $fileName = "logs.txt";
        if (!file_exists($fileName)) {
            echo "Cannot find file.";
        } else {
            $fileHandle = fopen($fileName, "a") or die("Unable to open");
            fwrite($fileHandle, "\n". $str);
            fclose($fileHandle);
        }
    }

    $function = $_POST["function"];

    if (isset($function)) {
        if ($function == "check_user") {
            $username = $_POST["username"];

            echo json_encode(sql("SELECT COUNT(*) count FROM user WHERE username = '$username'"));
        }
        else if ($function == "add_user") {
            $name = $_POST["name"];
            $lastname = $_POST["lastname"];
            $username = $_POST["username"];
            $password = $_POST["password"];
            $email = $_POST["email"];
            $level = $_POST["level"];
            $phone = $_POST["phone"];
            $birthday = $_POST["birthday"];

            sql("INSERT INTO user (username, password, name, lastname, email, level, phone, birthday, register_date)
            VALUES ('$username', '$password', '$name', '$lastname', '$email', $level, '$phone', '$birthday', NOW())");

            echo json_encode(sql("SELECT id FROM user WHERE username = '$username' AND password = '$password'"));
        }
        else if ($function == "login") {
            $username = $_POST["username"];
            $password = $_POST["password"];

            echo json_encode(sql("SELECT id FROM user WHERE username = '$username' AND password = '$password'"));
        }
        else if ($function == "get_transaction_titles") { // ยังไม่ได้ใช้

        }
        else if ($function == "add_transaction") {
            $user_id = $_POST["user_id"];
            $type = $_POST["type"];
            $title = $_POST["title"];
            $amount = $_POST["amount"];
            $date = $_POST["date"];

            sql("INSERT INTO transaction (user_id, type, title, amount, date, group_id)
            VALUES ($user_id, $type, '$title', $amount, '$date', (SELECT group_id FROM user WHERE id = $user_id))");

            echo json_encode(sql("SELECT id FROM transaction WHERE user_id = $user_id AND type = $type AND title = '$title' AND amount = $amount AND date = '$date'"));
        }
        else if ($function == "get_transactions_by_user_id") { // ยังไม่ได้ใช้
            $user_id = $_POST["user_id"];
            $date_from = $_POST["date_from"];
            $date_to = $_POST["date_to"];

        }
        else if ($function == "get_transactions_by_group_id") {
            $date_from = $_POST["date_from"];
            $date_to = $_POST["date_to"];
            $group_id = $_POST["group_id"];

            echo json_encode(sql("SELECT t.type, t.title, t.amount, t.date, CONCAT(u.name, ' ', u.lastname) name FROM transaction t, user u
                WHERE t.user_id = u.id AND '$date_from' <= DATE(t.date) AND DATE(t.date) <= '$date_to' AND t.group_id = $group_id"));
        }

    }
?>
