import nodeMailer from "nodemailer"


export async function sendMail ({ email, subject, html }){
    const adminEmail = 'maihongsonn@gmail.com';
    const adminPassword = 'tsie pgdp mrgo jpvi';
    
    const mailHost = 'smtp.gmail.com';
    const mailPort = 587;

    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false,
        auth: {
            user: adminEmail,
            pass: adminPassword
        },
    });


    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to: email, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: html
    };

    await transporter.sendMail(options)
}
