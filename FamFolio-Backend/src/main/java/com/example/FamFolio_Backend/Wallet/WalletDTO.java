package com.example.FamFolio_Backend.Wallet;

import java.math.BigDecimal;

public class WalletDTO {


    BigDecimal amount;
    String type;
    String verificationid;
    String pin;
    String updatetype;

    public WalletDTO() {
    }

    public WalletDTO(BigDecimal amount, String type, String verificationid, String pin) {
        this.amount = amount;
        this.type = type;
        this.verificationid = verificationid;
        this.pin = pin;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getVerificationid() {
        return verificationid;
    }

    public void setVerificationid(String verificationid) {
        this.verificationid = verificationid;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public String getUpdatetype() {
        return updatetype;
    }

    public void setUpdatetype(String updatetype) {
        this.updatetype = updatetype;
    }
}
