<?php
    mysql_connect("localhost","root","rootaemysql") or die("ไม่สามารถเชื่อมต่อฐานข้อมูลได้");
    mysql_select_db("income_cordova") or die(mysql_error());
    mysql_query("SET NAMES utf8");

    header('Access-Control-Allow-Origin: *');

    function sql($sql, $asArray = true) {
        $result = mysql_query($sql) or die($sql . "\n" . mysql_error());

        logs($sql);

        if ($result != undefined) {
            $rows = array();
            while ($r = mysql_fetch_assoc($result)) {
                // $rows[] = array_merge(array("i" => $number++), $r);
                $rows[] = $r;
            }

            if (count($rows) == 1 && !$asArray) {
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
        /******************** #user ********************/
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
            $group = $_POST["group"];
            $phone = $_POST["phone"];
            $birthday = $_POST["birthday"];

            if ($level = 0) {
                sql("INSERT INTO user (username, password, name, lastname, email, level, phone, birthday, register_date)
                VALUES ('$username', '$password', '$name', '$lastname', '$email', $level, '$phone', '$birthday', NOW())");
            }
            else {
                $code = "gl" . sql("SELECT LAST_INSERT_ID() + 1");
                sql("INSERT INTO `group` (title, code) VALUES ('$group', '$code')");

                $group_id = sql("SELECT id FROM `group` WHERE code = '$code'");

                sql("INSERT INTO user (username, password, name, lastname, email, level, phone, birthday, register_date)
                VALUES ('$username', '$password', '$name', '$lastname', '$email', $level, '$phone', '$birthday', NOW()), $group_id");
            }

            echo json_encode(sql("SELECT id, group_id FROM user WHERE username = '$username' AND password = '$password'"));
        }
        else if ($function == "login") {
            $username = $_POST["username"];
            $password = $_POST["password"];

            echo json_encode(sql("SELECT id, level, group_id FROM user WHERE username = '$username' AND password = '$password'", false));
        }
        else if ($function == "get_members_by_group_id") {
            $group_id = $_POST["group_id"];

            echo json_encode(sql("SELECT id, CONCAT(name, ' ', lastname) name, email, phone, group_id FROM user WHERE group_id = $group_id UNION
            SELECT id, CONCAT(name, ' ', lastname) name, email, phone, group_id FROM user WHERE group_id = (-1 * $group_id)"));
        }
        else if ($function == "get_group_detail_by_head_user_id") {
            $user_id = $_POST["user_id"];

            echo json_encode(sql("SELECT g.title, g.code, (SELECT COUNT(*) FROM user WHERE group_id = -1 * g.id) pending FROM `group` g, user u WHERE g.id = u.group_id AND u.id = $user_id", false));
        }
        else if ($function == "approve_member") {
            $user_id = $_POST["user_id"];

            sql("UPDATE user SET group_id = (-1 * group_id) WHERE id = $user_id");
            sql("UPDATE transaction SET group_id = (SELECT group_id FROM user WHERE id = $user_id) WHERE user_id = $user_id");
            echo json_error(sql("SELECT COUNT(*) ok FROM user WHERE id = $user_id AND group_id > 0"));
        }
        /******************** #transaction ********************/
        else if ($function == "get_transaction_titles") {
            $user_id = $_POST["user_id"];
            $type = $_POST["type"];

            echo json_encode(sql("SELECT DISTINCT(title) FROM transaction WHERE user_id = $user_id AND type = $type"));
        }
        else if ($function == "add_transaction") {
            $user_id = $_POST["user_id"];
            $type = $_POST["type"];
            $title = $_POST["title"];
            $amount = $_POST["amount"];
            $date = $_POST["date"];
            $group_id = $_POST["group_id"];

            sql("INSERT INTO transaction (user_id, type, title, amount, date, group_id)
            VALUES ($user_id, $type, '$title', $amount, '$date', $group_id)");

            echo json_encode(sql("SELECT id FROM transaction WHERE user_id = $user_id AND type = $type AND title = '$title' AND amount = $amount AND date = '$date'", false));
        }
        else if ($function == "get_transactions_by_user_id") {
            $user_id = $_POST["user_id"];
            $date_from = $_POST["date_from"];
            $date_to = $_POST["date_to"];

            echo json_encode(sql("SELECT t.type, t.title, t.amount, t.date FROM transaction t, user u
                WHERE t.user_id = u.id AND '$date_from' <= DATE(t.date) AND DATE(t.date) <= '$date_to' AND u.id = $user_id
                ORDER BY DATE(t.date)"));
        }
        else if ($function == "get_transactions_by_title_by_user_id") {
            $user_id = $_POST["user_id"];
            $date_from = $_POST["date_from"];
            $date_to = $_POST["date_to"];

            echo json_encode(sql("SELECT t.type, t.title, SUM(t.amount) amount, COUNT(*) count FROM transaction t, user u
                WHERE t.user_id = u.id AND '$date_from' <= DATE(t.date) AND DATE(t.date) <= '$date_to' AND u.id = $user_id
                GROUP BY type, title ORDER BY amount DESC"));
        }
        else if ($function == "get_transactions_group_by_date_by_user_id") {
            $user_id = $_POST["user_id"];
            $date_from = $_POST["date_from"];
            $date_to = $_POST["date_to"];

            echo json_encode(sql("SELECT DATE(t.date) date, SUM(if(type = 0, t.amount, 0)) income, SUM(if(type = 0, 1, 0)) count_income, SUM(if(type = 1, t.amount, 0)) outcome, SUM(if(type = 1, 1, 0)) count_outcome
                FROM transaction t, user u
                WHERE t.user_id = u.id AND '$date_from' <= DATE(t.date) AND DATE(t.date) <= '$date_to' AND u.id = $user_id
                GROUP BY DATE(t.date)"));
        }
        else if ($function == "get_transactions_by_group_id") {
            $date_from = $_POST["date_from"];
            $date_to = $_POST["date_to"];
            $group_id = $_POST["group_id"];

            echo json_encode(sql("SELECT t.type, t.title, t.amount, t.date, CONCAT(u.name, ' ', u.lastname) name FROM transaction t, user u
                WHERE t.user_id = u.id AND '$date_from' <= DATE(t.date) AND DATE(t.date) <= '$date_to' AND u.group_id = $group_id
                ORDER BY DATE(t.date)"));
        }
        /******************** #group ********************/
        else if ($function == "get_group") {
            $group_id = $_POST["group_id"];

            echo json_encode(sql("SELECT id, title, code FROM `group` WHERE id = $group_id", false));
        }
        else if ($function == "get_groups") {

            echo json_encode(sql("SELECT id, title, code FROM `group`"));
        }
        else if ($function == "join_group") {
            $user_id = $_POST["user_id"];
            $group_id = $_POST["group_id"];

            echo sql("UPDATE user SET group_id = $group_id WHERE id = $user_id");
            echo json_encode(sql("SELECT COUNT(*) ok FROM user WHERE id = $user_id AND group_id = $group_id", false));
        }
    }
?>
