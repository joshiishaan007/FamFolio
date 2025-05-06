
    create table categories (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        icon_name varchar(50),
        name varchar(100) not null,
        description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table payments (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        initiated_by bigint not null,
        source_wallet_id bigint not null,
        updated_at datetime(6) not null,
        destination_type varchar(20) not null,
        payment_method varchar(20) not null,
        payment_status varchar(20) not null,
        destination_identifier varchar(100) not null,
        payment_gateway_reference varchar(100),
        payment_purpose varchar(100),
        transaction_id varchar(100) not null,
        failure_reason varchar(255),
        gateway_response json,
        merchant_name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_actions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        action_type varchar(50) not null,
        action_config json,
        primary key (id)
    ) engine=InnoDB;

    create table rule_conditions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        operator varchar(20) not null,
        condition_type varchar(50) not null,
        value_string varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_violations (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        transaction_id bigint not null,
        violation_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rules (
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint,
        owner_id bigint not null,
        updated_at datetime(6) not null,
        rule_type varchar(50) not null,
        rule_name varchar(100) not null,
        primary key (id)
    ) engine=InnoDB;

    create table transaction_approvals (
        approved_by bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        requested_by bigint not null,
        transaction_id bigint not null,
        updated_at datetime(6) not null,
        status varchar(20) not null,
        approval_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table transactions (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        payment_id bigint,
        updated_at datetime(6) not null,
        user_id bigint not null,
        wallet_id bigint not null,
        status varchar(20) not null,
        upi_reference varchar(100),
        description varchar(255),
        status_reason varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_relationships (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint not null,
        owner_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        date_of_birth date not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        aadhar_number varchar(12) not null,
        phone_number varchar(20) not null,
        email varchar(100) not null,
        name varchar(100) not null,
        password_hash varchar(255) not null,
        role varchar(255) not null,
        username varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table wallets (
        balance decimal(19,4) not null,
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        user_id bigint not null,
        upi_id varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table categories 
       add constraint UKt8o6pivur7nn124jehx7cygw5 unique (name);

    alter table payments 
       add constraint UKlryndveuwa4k5qthti0pkmtlx unique (transaction_id);

    alter table users 
       add constraint UK2hrluauwb53v8e0geuf6iovoe unique (aadhar_number);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);

    alter table wallets 
       add constraint UKsswfdl9fq40xlkove1y5kc7kv unique (user_id);

    alter table wallets 
       add constraint UKtdu4uea1lveiopgmd38yqpmle unique (upi_id);

    alter table payments 
       add constraint FKmuffrx3ov30hi7n6h6vr5ru7i 
       foreign key (category_id) 
       references categories (id);

    alter table payments 
       add constraint FK8mj08peqy83xpb78j5gdc827a 
       foreign key (initiated_by) 
       references users (id);

    alter table payments 
       add constraint FKoqyrt0d6n1mko3bwfskxn7fta 
       foreign key (source_wallet_id) 
       references wallets (id);

    alter table rule_actions 
       add constraint FK9w0ccpgdy8rhix4emgmsjwj1i 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_conditions 
       add constraint FK1c1px9a74wdkeir44qrws5vy0 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FKap6tco67b7f00xw5rbdkji6yg 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FK7gr9nc5744vhb5xqokg4nc10n 
       foreign key (transaction_id) 
       references transactions (id);

    alter table rules 
       add constraint FKfmy9pyjcpliw9wxojmtfh08ed 
       foreign key (member_id) 
       references users (id);

    alter table rules 
       add constraint FKwpn15j7e1lk2372bjjy6beoi 
       foreign key (owner_id) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKaoyupns443pwqefe7mf8c7tir 
       foreign key (approved_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKa38924vp2rkgh1cpw2uj206lb 
       foreign key (requested_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKiytxj19f6gwr144s3a550swe8 
       foreign key (transaction_id) 
       references transactions (id);

    alter table transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories (id);

    alter table transactions 
       add constraint FKmt44qv8av8abvaqb5nbhjnmi2 
       foreign key (payment_id) 
       references payments (id);

    alter table transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users (id);

    alter table transactions 
       add constraint FK23bop5lktue0o5q7kr19ti8h 
       foreign key (wallet_id) 
       references wallets (id);

    alter table user_relationships 
       add constraint FKq85lfmt4ofyexrumt31rj8r5x 
       foreign key (member_id) 
       references users (id);

    alter table user_relationships 
       add constraint FK4dptlwsivqf9qmatelw8q3lvl 
       foreign key (owner_id) 
       references users (id);

    alter table wallets 
       add constraint FKc1foyisidw7wqqrkamafuwn4e 
       foreign key (user_id) 
       references users (id);

    create table categories (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        icon_name varchar(50),
        name varchar(100) not null,
        description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table payments (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        initiated_by bigint not null,
        source_wallet_id bigint not null,
        updated_at datetime(6) not null,
        destination_type varchar(20) not null,
        payment_method varchar(20) not null,
        payment_status varchar(20) not null,
        destination_identifier varchar(100) not null,
        payment_gateway_reference varchar(100),
        payment_purpose varchar(100),
        transaction_id varchar(100) not null,
        failure_reason varchar(255),
        gateway_response json,
        merchant_name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_actions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        action_type varchar(50) not null,
        action_config json,
        primary key (id)
    ) engine=InnoDB;

    create table rule_conditions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        operator varchar(20) not null,
        condition_type varchar(50) not null,
        value_string varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_violations (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        transaction_id bigint not null,
        violation_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rules (
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint,
        owner_id bigint not null,
        updated_at datetime(6) not null,
        rule_type varchar(50) not null,
        rule_name varchar(100) not null,
        primary key (id)
    ) engine=InnoDB;

    create table transaction_approvals (
        approved_by bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        requested_by bigint not null,
        transaction_id bigint not null,
        updated_at datetime(6) not null,
        status varchar(20) not null,
        approval_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table transactions (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        payment_id bigint,
        updated_at datetime(6) not null,
        user_id bigint not null,
        wallet_id bigint not null,
        status varchar(20) not null,
        upi_reference varchar(100),
        description varchar(255),
        status_reason varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_relationships (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint not null,
        owner_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        date_of_birth date not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        aadhar_number varchar(12) not null,
        phone_number varchar(20) not null,
        email varchar(100) not null,
        name varchar(100) not null,
        password_hash varchar(255) not null,
        role varchar(255) not null,
        username varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table wallets (
        balance decimal(19,4) not null,
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        user_id bigint not null,
        upi_id varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table categories 
       add constraint UKt8o6pivur7nn124jehx7cygw5 unique (name);

    alter table payments 
       add constraint UKlryndveuwa4k5qthti0pkmtlx unique (transaction_id);

    alter table users 
       add constraint UK2hrluauwb53v8e0geuf6iovoe unique (aadhar_number);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);

    alter table wallets 
       add constraint UKsswfdl9fq40xlkove1y5kc7kv unique (user_id);

    alter table wallets 
       add constraint UKtdu4uea1lveiopgmd38yqpmle unique (upi_id);

    alter table payments 
       add constraint FKmuffrx3ov30hi7n6h6vr5ru7i 
       foreign key (category_id) 
       references categories (id);

    alter table payments 
       add constraint FK8mj08peqy83xpb78j5gdc827a 
       foreign key (initiated_by) 
       references users (id);

    alter table payments 
       add constraint FKoqyrt0d6n1mko3bwfskxn7fta 
       foreign key (source_wallet_id) 
       references wallets (id);

    alter table rule_actions 
       add constraint FK9w0ccpgdy8rhix4emgmsjwj1i 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_conditions 
       add constraint FK1c1px9a74wdkeir44qrws5vy0 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FKap6tco67b7f00xw5rbdkji6yg 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FK7gr9nc5744vhb5xqokg4nc10n 
       foreign key (transaction_id) 
       references transactions (id);

    alter table rules 
       add constraint FKfmy9pyjcpliw9wxojmtfh08ed 
       foreign key (member_id) 
       references users (id);

    alter table rules 
       add constraint FKwpn15j7e1lk2372bjjy6beoi 
       foreign key (owner_id) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKaoyupns443pwqefe7mf8c7tir 
       foreign key (approved_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKa38924vp2rkgh1cpw2uj206lb 
       foreign key (requested_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKiytxj19f6gwr144s3a550swe8 
       foreign key (transaction_id) 
       references transactions (id);

    alter table transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories (id);

    alter table transactions 
       add constraint FKmt44qv8av8abvaqb5nbhjnmi2 
       foreign key (payment_id) 
       references payments (id);

    alter table transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users (id);

    alter table transactions 
       add constraint FK23bop5lktue0o5q7kr19ti8h 
       foreign key (wallet_id) 
       references wallets (id);

    alter table user_relationships 
       add constraint FKq85lfmt4ofyexrumt31rj8r5x 
       foreign key (member_id) 
       references users (id);

    alter table user_relationships 
       add constraint FK4dptlwsivqf9qmatelw8q3lvl 
       foreign key (owner_id) 
       references users (id);

    alter table wallets 
       add constraint FKc1foyisidw7wqqrkamafuwn4e 
       foreign key (user_id) 
       references users (id);

    create table categories (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        icon_name varchar(50),
        name varchar(100) not null,
        description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table payments (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        initiated_by bigint not null,
        source_wallet_id bigint not null,
        updated_at datetime(6) not null,
        destination_type varchar(20) not null,
        payment_method varchar(20) not null,
        payment_status varchar(20) not null,
        destination_identifier varchar(100) not null,
        payment_gateway_reference varchar(100),
        payment_purpose varchar(100),
        transaction_id varchar(100) not null,
        failure_reason varchar(255),
        gateway_response json,
        merchant_name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_actions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        action_type varchar(50) not null,
        action_config json,
        primary key (id)
    ) engine=InnoDB;

    create table rule_conditions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        operator varchar(20) not null,
        condition_type varchar(50) not null,
        value_string varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_violations (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        transaction_id bigint not null,
        violation_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rules (
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint,
        owner_id bigint not null,
        updated_at datetime(6) not null,
        rule_type varchar(50) not null,
        rule_name varchar(100) not null,
        primary key (id)
    ) engine=InnoDB;

    create table transaction_approvals (
        approved_by bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        requested_by bigint not null,
        transaction_id bigint not null,
        updated_at datetime(6) not null,
        status varchar(20) not null,
        approval_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table transactions (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        payment_id bigint,
        updated_at datetime(6) not null,
        user_id bigint not null,
        wallet_id bigint not null,
        status varchar(20) not null,
        upi_reference varchar(100),
        description varchar(255),
        status_reason varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_relationships (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint not null,
        owner_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        date_of_birth date not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        aadhar_number varchar(12) not null,
        phone_number varchar(20) not null,
        email varchar(100) not null,
        name varchar(100) not null,
        password_hash varchar(255) not null,
        role varchar(255) not null,
        username varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table wallets (
        balance decimal(19,4) not null,
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        user_id bigint not null,
        upi_id varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table categories 
       add constraint UKt8o6pivur7nn124jehx7cygw5 unique (name);

    alter table payments 
       add constraint UKlryndveuwa4k5qthti0pkmtlx unique (transaction_id);

    alter table users 
       add constraint UK2hrluauwb53v8e0geuf6iovoe unique (aadhar_number);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);

    alter table wallets 
       add constraint UKsswfdl9fq40xlkove1y5kc7kv unique (user_id);

    alter table wallets 
       add constraint UKtdu4uea1lveiopgmd38yqpmle unique (upi_id);

    alter table payments 
       add constraint FKmuffrx3ov30hi7n6h6vr5ru7i 
       foreign key (category_id) 
       references categories (id);

    alter table payments 
       add constraint FK8mj08peqy83xpb78j5gdc827a 
       foreign key (initiated_by) 
       references users (id);

    alter table payments 
       add constraint FKoqyrt0d6n1mko3bwfskxn7fta 
       foreign key (source_wallet_id) 
       references wallets (id);

    alter table rule_actions 
       add constraint FK9w0ccpgdy8rhix4emgmsjwj1i 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_conditions 
       add constraint FK1c1px9a74wdkeir44qrws5vy0 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FKap6tco67b7f00xw5rbdkji6yg 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FK7gr9nc5744vhb5xqokg4nc10n 
       foreign key (transaction_id) 
       references transactions (id);

    alter table rules 
       add constraint FKfmy9pyjcpliw9wxojmtfh08ed 
       foreign key (member_id) 
       references users (id);

    alter table rules 
       add constraint FKwpn15j7e1lk2372bjjy6beoi 
       foreign key (owner_id) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKaoyupns443pwqefe7mf8c7tir 
       foreign key (approved_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKa38924vp2rkgh1cpw2uj206lb 
       foreign key (requested_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKiytxj19f6gwr144s3a550swe8 
       foreign key (transaction_id) 
       references transactions (id);

    alter table transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories (id);

    alter table transactions 
       add constraint FKmt44qv8av8abvaqb5nbhjnmi2 
       foreign key (payment_id) 
       references payments (id);

    alter table transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users (id);

    alter table transactions 
       add constraint FK23bop5lktue0o5q7kr19ti8h 
       foreign key (wallet_id) 
       references wallets (id);

    alter table user_relationships 
       add constraint FKq85lfmt4ofyexrumt31rj8r5x 
       foreign key (member_id) 
       references users (id);

    alter table user_relationships 
       add constraint FK4dptlwsivqf9qmatelw8q3lvl 
       foreign key (owner_id) 
       references users (id);

    alter table wallets 
       add constraint FKc1foyisidw7wqqrkamafuwn4e 
       foreign key (user_id) 
       references users (id);

    create table categories (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        icon_name varchar(50),
        name varchar(100) not null,
        description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table payments (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        initiated_by bigint not null,
        source_wallet_id bigint not null,
        updated_at datetime(6) not null,
        destination_type varchar(20) not null,
        payment_method varchar(20) not null,
        payment_status varchar(20) not null,
        destination_identifier varchar(100) not null,
        payment_gateway_reference varchar(100),
        payment_purpose varchar(100),
        transaction_id varchar(100) not null,
        failure_reason varchar(255),
        gateway_response json,
        merchant_name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_actions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        action_type varchar(50) not null,
        action_config json,
        primary key (id)
    ) engine=InnoDB;

    create table rule_conditions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        operator varchar(20) not null,
        condition_type varchar(50) not null,
        value_string varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_violations (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        transaction_id bigint not null,
        violation_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rules (
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint,
        owner_id bigint not null,
        updated_at datetime(6) not null,
        rule_type varchar(50) not null,
        rule_name varchar(100) not null,
        primary key (id)
    ) engine=InnoDB;

    create table transaction_approvals (
        approved_by bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        requested_by bigint not null,
        transaction_id bigint not null,
        updated_at datetime(6) not null,
        status varchar(20) not null,
        approval_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table transactions (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        payment_id bigint,
        updated_at datetime(6) not null,
        user_id bigint not null,
        wallet_id bigint not null,
        status varchar(20) not null,
        upi_reference varchar(100),
        description varchar(255),
        status_reason varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_relationships (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint not null,
        owner_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        date_of_birth date not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        aadhar_number varchar(12) not null,
        phone_number varchar(20) not null,
        email varchar(100) not null,
        name varchar(100) not null,
        password_hash varchar(255) not null,
        role varchar(255) not null,
        username varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table wallets (
        balance decimal(19,4) not null,
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        user_id bigint not null,
        upi_id varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table categories 
       add constraint UKt8o6pivur7nn124jehx7cygw5 unique (name);

    alter table payments 
       add constraint UKlryndveuwa4k5qthti0pkmtlx unique (transaction_id);

    alter table users 
       add constraint UK2hrluauwb53v8e0geuf6iovoe unique (aadhar_number);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);

    alter table wallets 
       add constraint UKsswfdl9fq40xlkove1y5kc7kv unique (user_id);

    alter table wallets 
       add constraint UKtdu4uea1lveiopgmd38yqpmle unique (upi_id);

    alter table payments 
       add constraint FKmuffrx3ov30hi7n6h6vr5ru7i 
       foreign key (category_id) 
       references categories (id);

    alter table payments 
       add constraint FK8mj08peqy83xpb78j5gdc827a 
       foreign key (initiated_by) 
       references users (id);

    alter table payments 
       add constraint FKoqyrt0d6n1mko3bwfskxn7fta 
       foreign key (source_wallet_id) 
       references wallets (id);

    alter table rule_actions 
       add constraint FK9w0ccpgdy8rhix4emgmsjwj1i 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_conditions 
       add constraint FK1c1px9a74wdkeir44qrws5vy0 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FKap6tco67b7f00xw5rbdkji6yg 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FK7gr9nc5744vhb5xqokg4nc10n 
       foreign key (transaction_id) 
       references transactions (id);

    alter table rules 
       add constraint FKfmy9pyjcpliw9wxojmtfh08ed 
       foreign key (member_id) 
       references users (id);

    alter table rules 
       add constraint FKwpn15j7e1lk2372bjjy6beoi 
       foreign key (owner_id) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKaoyupns443pwqefe7mf8c7tir 
       foreign key (approved_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKa38924vp2rkgh1cpw2uj206lb 
       foreign key (requested_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKiytxj19f6gwr144s3a550swe8 
       foreign key (transaction_id) 
       references transactions (id);

    alter table transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories (id);

    alter table transactions 
       add constraint FKmt44qv8av8abvaqb5nbhjnmi2 
       foreign key (payment_id) 
       references payments (id);

    alter table transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users (id);

    alter table transactions 
       add constraint FK23bop5lktue0o5q7kr19ti8h 
       foreign key (wallet_id) 
       references wallets (id);

    alter table user_relationships 
       add constraint FKq85lfmt4ofyexrumt31rj8r5x 
       foreign key (member_id) 
       references users (id);

    alter table user_relationships 
       add constraint FK4dptlwsivqf9qmatelw8q3lvl 
       foreign key (owner_id) 
       references users (id);

    alter table wallets 
       add constraint FKc1foyisidw7wqqrkamafuwn4e 
       foreign key (user_id) 
       references users (id);

    create table categories (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        icon_name varchar(50),
        name varchar(100) not null,
        description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table payments (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        initiated_by bigint not null,
        source_wallet_id bigint not null,
        updated_at datetime(6) not null,
        destination_type varchar(20) not null,
        payment_method varchar(20) not null,
        payment_status varchar(20) not null,
        destination_identifier varchar(100) not null,
        payment_gateway_reference varchar(100),
        payment_purpose varchar(100),
        transaction_id varchar(100) not null,
        failure_reason varchar(255),
        gateway_response json,
        merchant_name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_actions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        action_type varchar(50) not null,
        action_config json,
        primary key (id)
    ) engine=InnoDB;

    create table rule_conditions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        operator varchar(20) not null,
        condition_type varchar(50) not null,
        value_string varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_violations (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        transaction_id bigint not null,
        violation_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rules (
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint,
        owner_id bigint not null,
        updated_at datetime(6) not null,
        rule_type varchar(50) not null,
        rule_name varchar(100) not null,
        primary key (id)
    ) engine=InnoDB;

    create table transaction_approvals (
        approved_by bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        requested_by bigint not null,
        transaction_id bigint not null,
        updated_at datetime(6) not null,
        status varchar(20) not null,
        approval_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table transactions (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        payment_id bigint,
        updated_at datetime(6) not null,
        user_id bigint not null,
        wallet_id bigint not null,
        status varchar(20) not null,
        upi_reference varchar(100),
        description varchar(255),
        status_reason varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_relationships (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint not null,
        owner_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        date_of_birth date not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        aadhar_number varchar(12) not null,
        phone_number varchar(20) not null,
        email varchar(100) not null,
        name varchar(100) not null,
        password_hash varchar(255) not null,
        role varchar(255) not null,
        username varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table wallets (
        balance decimal(19,4) not null,
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        user_id bigint not null,
        upi_id varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table categories 
       add constraint UKt8o6pivur7nn124jehx7cygw5 unique (name);

    alter table payments 
       add constraint UKlryndveuwa4k5qthti0pkmtlx unique (transaction_id);

    alter table users 
       add constraint UK2hrluauwb53v8e0geuf6iovoe unique (aadhar_number);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);

    alter table wallets 
       add constraint UKsswfdl9fq40xlkove1y5kc7kv unique (user_id);

    alter table wallets 
       add constraint UKtdu4uea1lveiopgmd38yqpmle unique (upi_id);

    alter table payments 
       add constraint FKmuffrx3ov30hi7n6h6vr5ru7i 
       foreign key (category_id) 
       references categories (id);

    alter table payments 
       add constraint FK8mj08peqy83xpb78j5gdc827a 
       foreign key (initiated_by) 
       references users (id);

    alter table payments 
       add constraint FKoqyrt0d6n1mko3bwfskxn7fta 
       foreign key (source_wallet_id) 
       references wallets (id);

    alter table rule_actions 
       add constraint FK9w0ccpgdy8rhix4emgmsjwj1i 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_conditions 
       add constraint FK1c1px9a74wdkeir44qrws5vy0 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FKap6tco67b7f00xw5rbdkji6yg 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FK7gr9nc5744vhb5xqokg4nc10n 
       foreign key (transaction_id) 
       references transactions (id);

    alter table rules 
       add constraint FKfmy9pyjcpliw9wxojmtfh08ed 
       foreign key (member_id) 
       references users (id);

    alter table rules 
       add constraint FKwpn15j7e1lk2372bjjy6beoi 
       foreign key (owner_id) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKaoyupns443pwqefe7mf8c7tir 
       foreign key (approved_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKa38924vp2rkgh1cpw2uj206lb 
       foreign key (requested_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKiytxj19f6gwr144s3a550swe8 
       foreign key (transaction_id) 
       references transactions (id);

    alter table transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories (id);

    alter table transactions 
       add constraint FKmt44qv8av8abvaqb5nbhjnmi2 
       foreign key (payment_id) 
       references payments (id);

    alter table transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users (id);

    alter table transactions 
       add constraint FK23bop5lktue0o5q7kr19ti8h 
       foreign key (wallet_id) 
       references wallets (id);

    alter table user_relationships 
       add constraint FKq85lfmt4ofyexrumt31rj8r5x 
       foreign key (member_id) 
       references users (id);

    alter table user_relationships 
       add constraint FK4dptlwsivqf9qmatelw8q3lvl 
       foreign key (owner_id) 
       references users (id);

    alter table wallets 
       add constraint FKc1foyisidw7wqqrkamafuwn4e 
       foreign key (user_id) 
       references users (id);

    create table categories (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        icon_name varchar(50),
        name varchar(100) not null,
        description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table payments (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        initiated_by bigint not null,
        source_wallet_id bigint not null,
        updated_at datetime(6) not null,
        destination_type varchar(20) not null,
        payment_method varchar(20) not null,
        payment_status varchar(20) not null,
        destination_identifier varchar(100) not null,
        payment_gateway_reference varchar(100),
        payment_purpose varchar(100),
        transaction_id varchar(100) not null,
        failure_reason varchar(255),
        gateway_response json,
        merchant_name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_actions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        action_type varchar(50) not null,
        action_config json,
        primary key (id)
    ) engine=InnoDB;

    create table rule_conditions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        operator varchar(20) not null,
        condition_type varchar(50) not null,
        value_string varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_violations (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        transaction_id bigint not null,
        violation_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rules (
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint,
        owner_id bigint not null,
        updated_at datetime(6) not null,
        rule_type varchar(50) not null,
        rule_name varchar(100) not null,
        primary key (id)
    ) engine=InnoDB;

    create table transaction_approvals (
        approved_by bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        requested_by bigint not null,
        transaction_id bigint not null,
        updated_at datetime(6) not null,
        status varchar(20) not null,
        approval_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table transactions (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        payment_id bigint,
        updated_at datetime(6) not null,
        user_id bigint not null,
        wallet_id bigint not null,
        status varchar(20) not null,
        upi_reference varchar(100),
        description varchar(255),
        status_reason varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_relationships (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint not null,
        owner_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        date_of_birth date not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        aadhar_number varchar(12) not null,
        phone_number varchar(20) not null,
        email varchar(100) not null,
        name varchar(100) not null,
        password_hash varchar(255) not null,
        role varchar(255) not null,
        username varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table wallets (
        balance decimal(19,4) not null,
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        user_id bigint not null,
        upi_id varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table categories 
       add constraint UKt8o6pivur7nn124jehx7cygw5 unique (name);

    alter table payments 
       add constraint UKlryndveuwa4k5qthti0pkmtlx unique (transaction_id);

    alter table users 
       add constraint UK2hrluauwb53v8e0geuf6iovoe unique (aadhar_number);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);

    alter table wallets 
       add constraint UKsswfdl9fq40xlkove1y5kc7kv unique (user_id);

    alter table wallets 
       add constraint UKtdu4uea1lveiopgmd38yqpmle unique (upi_id);

    alter table payments 
       add constraint FKmuffrx3ov30hi7n6h6vr5ru7i 
       foreign key (category_id) 
       references categories (id);

    alter table payments 
       add constraint FK8mj08peqy83xpb78j5gdc827a 
       foreign key (initiated_by) 
       references users (id);

    alter table payments 
       add constraint FKoqyrt0d6n1mko3bwfskxn7fta 
       foreign key (source_wallet_id) 
       references wallets (id);

    alter table rule_actions 
       add constraint FK9w0ccpgdy8rhix4emgmsjwj1i 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_conditions 
       add constraint FK1c1px9a74wdkeir44qrws5vy0 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FKap6tco67b7f00xw5rbdkji6yg 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FK7gr9nc5744vhb5xqokg4nc10n 
       foreign key (transaction_id) 
       references transactions (id);

    alter table rules 
       add constraint FKfmy9pyjcpliw9wxojmtfh08ed 
       foreign key (member_id) 
       references users (id);

    alter table rules 
       add constraint FKwpn15j7e1lk2372bjjy6beoi 
       foreign key (owner_id) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKaoyupns443pwqefe7mf8c7tir 
       foreign key (approved_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKa38924vp2rkgh1cpw2uj206lb 
       foreign key (requested_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKiytxj19f6gwr144s3a550swe8 
       foreign key (transaction_id) 
       references transactions (id);

    alter table transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories (id);

    alter table transactions 
       add constraint FKmt44qv8av8abvaqb5nbhjnmi2 
       foreign key (payment_id) 
       references payments (id);

    alter table transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users (id);

    alter table transactions 
       add constraint FK23bop5lktue0o5q7kr19ti8h 
       foreign key (wallet_id) 
       references wallets (id);

    alter table user_relationships 
       add constraint FKq85lfmt4ofyexrumt31rj8r5x 
       foreign key (member_id) 
       references users (id);

    alter table user_relationships 
       add constraint FK4dptlwsivqf9qmatelw8q3lvl 
       foreign key (owner_id) 
       references users (id);

    alter table wallets 
       add constraint FKc1foyisidw7wqqrkamafuwn4e 
       foreign key (user_id) 
       references users (id);

    create table categories (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        icon_name varchar(50),
        name varchar(100) not null,
        description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table payments (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        initiated_by bigint not null,
        source_wallet_id bigint not null,
        updated_at datetime(6) not null,
        destination_type varchar(20) not null,
        payment_method varchar(20) not null,
        payment_status varchar(20) not null,
        destination_identifier varchar(100) not null,
        payment_gateway_reference varchar(100),
        payment_purpose varchar(100),
        transaction_id varchar(100) not null,
        failure_reason varchar(255),
        gateway_response json,
        merchant_name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_actions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        action_type varchar(50) not null,
        action_config json,
        primary key (id)
    ) engine=InnoDB;

    create table rule_conditions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        operator varchar(20) not null,
        condition_type varchar(50) not null,
        value_string varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_violations (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        transaction_id bigint not null,
        violation_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rules (
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint,
        owner_id bigint not null,
        updated_at datetime(6) not null,
        rule_type varchar(50) not null,
        rule_name varchar(100) not null,
        primary key (id)
    ) engine=InnoDB;

    create table transaction_approvals (
        approved_by bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        requested_by bigint not null,
        transaction_id bigint not null,
        updated_at datetime(6) not null,
        status varchar(20) not null,
        approval_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table transactions (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        payment_id bigint,
        updated_at datetime(6) not null,
        user_id bigint not null,
        wallet_id bigint not null,
        status varchar(20) not null,
        upi_reference varchar(100),
        description varchar(255),
        status_reason varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_relationships (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint not null,
        owner_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        date_of_birth date not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        aadhar_number varchar(12) not null,
        phone_number varchar(20) not null,
        email varchar(100) not null,
        name varchar(100) not null,
        password_hash varchar(255) not null,
        role varchar(255) not null,
        username varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table wallets (
        balance decimal(19,4) not null,
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        user_id bigint not null,
        upi_id varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table categories 
       add constraint UKt8o6pivur7nn124jehx7cygw5 unique (name);

    alter table payments 
       add constraint UKlryndveuwa4k5qthti0pkmtlx unique (transaction_id);

    alter table users 
       add constraint UK2hrluauwb53v8e0geuf6iovoe unique (aadhar_number);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);

    alter table wallets 
       add constraint UKsswfdl9fq40xlkove1y5kc7kv unique (user_id);

    alter table wallets 
       add constraint UKtdu4uea1lveiopgmd38yqpmle unique (upi_id);

    alter table payments 
       add constraint FKmuffrx3ov30hi7n6h6vr5ru7i 
       foreign key (category_id) 
       references categories (id);

    alter table payments 
       add constraint FK8mj08peqy83xpb78j5gdc827a 
       foreign key (initiated_by) 
       references users (id);

    alter table payments 
       add constraint FKoqyrt0d6n1mko3bwfskxn7fta 
       foreign key (source_wallet_id) 
       references wallets (id);

    alter table rule_actions 
       add constraint FK9w0ccpgdy8rhix4emgmsjwj1i 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_conditions 
       add constraint FK1c1px9a74wdkeir44qrws5vy0 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FKap6tco67b7f00xw5rbdkji6yg 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FK7gr9nc5744vhb5xqokg4nc10n 
       foreign key (transaction_id) 
       references transactions (id);

    alter table rules 
       add constraint FKfmy9pyjcpliw9wxojmtfh08ed 
       foreign key (member_id) 
       references users (id);

    alter table rules 
       add constraint FKwpn15j7e1lk2372bjjy6beoi 
       foreign key (owner_id) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKaoyupns443pwqefe7mf8c7tir 
       foreign key (approved_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKa38924vp2rkgh1cpw2uj206lb 
       foreign key (requested_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKiytxj19f6gwr144s3a550swe8 
       foreign key (transaction_id) 
       references transactions (id);

    alter table transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories (id);

    alter table transactions 
       add constraint FKmt44qv8av8abvaqb5nbhjnmi2 
       foreign key (payment_id) 
       references payments (id);

    alter table transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users (id);

    alter table transactions 
       add constraint FK23bop5lktue0o5q7kr19ti8h 
       foreign key (wallet_id) 
       references wallets (id);

    alter table user_relationships 
       add constraint FKq85lfmt4ofyexrumt31rj8r5x 
       foreign key (member_id) 
       references users (id);

    alter table user_relationships 
       add constraint FK4dptlwsivqf9qmatelw8q3lvl 
       foreign key (owner_id) 
       references users (id);

    alter table wallets 
       add constraint FKc1foyisidw7wqqrkamafuwn4e 
       foreign key (user_id) 
       references users (id);

    create table categories (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        icon_name varchar(50),
        name varchar(100) not null,
        description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table payments (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        initiated_by bigint not null,
        source_wallet_id bigint not null,
        updated_at datetime(6) not null,
        destination_type varchar(20) not null,
        payment_method varchar(20) not null,
        payment_status varchar(20) not null,
        destination_identifier varchar(100) not null,
        payment_gateway_reference varchar(100),
        payment_purpose varchar(100),
        transaction_id varchar(100) not null,
        failure_reason varchar(255),
        gateway_response json,
        merchant_name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_actions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        action_type varchar(50) not null,
        action_config json,
        primary key (id)
    ) engine=InnoDB;

    create table rule_conditions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        operator varchar(20) not null,
        condition_type varchar(50) not null,
        value_string varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_violations (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        transaction_id bigint not null,
        violation_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rules (
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint,
        owner_id bigint not null,
        updated_at datetime(6) not null,
        rule_type varchar(50) not null,
        rule_name varchar(100) not null,
        primary key (id)
    ) engine=InnoDB;

    create table transaction_approvals (
        approved_by bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        requested_by bigint not null,
        transaction_id bigint not null,
        updated_at datetime(6) not null,
        status varchar(20) not null,
        approval_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table transactions (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        payment_id bigint,
        updated_at datetime(6) not null,
        user_id bigint not null,
        wallet_id bigint not null,
        status varchar(20) not null,
        upi_reference varchar(100),
        description varchar(255),
        status_reason varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_relationships (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint not null,
        owner_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        date_of_birth date not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        aadhar_number varchar(12) not null,
        phone_number varchar(20) not null,
        email varchar(100) not null,
        name varchar(100) not null,
        password_hash varchar(255) not null,
        role varchar(255) not null,
        username varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table wallets (
        balance decimal(19,4) not null,
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        user_id bigint not null,
        upi_id varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table categories 
       add constraint UKt8o6pivur7nn124jehx7cygw5 unique (name);

    alter table payments 
       add constraint UKlryndveuwa4k5qthti0pkmtlx unique (transaction_id);

    alter table users 
       add constraint UK2hrluauwb53v8e0geuf6iovoe unique (aadhar_number);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);

    alter table wallets 
       add constraint UKsswfdl9fq40xlkove1y5kc7kv unique (user_id);

    alter table wallets 
       add constraint UKtdu4uea1lveiopgmd38yqpmle unique (upi_id);

    alter table payments 
       add constraint FKmuffrx3ov30hi7n6h6vr5ru7i 
       foreign key (category_id) 
       references categories (id);

    alter table payments 
       add constraint FK8mj08peqy83xpb78j5gdc827a 
       foreign key (initiated_by) 
       references users (id);

    alter table payments 
       add constraint FKoqyrt0d6n1mko3bwfskxn7fta 
       foreign key (source_wallet_id) 
       references wallets (id);

    alter table rule_actions 
       add constraint FK9w0ccpgdy8rhix4emgmsjwj1i 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_conditions 
       add constraint FK1c1px9a74wdkeir44qrws5vy0 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FKap6tco67b7f00xw5rbdkji6yg 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FK7gr9nc5744vhb5xqokg4nc10n 
       foreign key (transaction_id) 
       references transactions (id);

    alter table rules 
       add constraint FKfmy9pyjcpliw9wxojmtfh08ed 
       foreign key (member_id) 
       references users (id);

    alter table rules 
       add constraint FKwpn15j7e1lk2372bjjy6beoi 
       foreign key (owner_id) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKaoyupns443pwqefe7mf8c7tir 
       foreign key (approved_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKa38924vp2rkgh1cpw2uj206lb 
       foreign key (requested_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKiytxj19f6gwr144s3a550swe8 
       foreign key (transaction_id) 
       references transactions (id);

    alter table transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories (id);

    alter table transactions 
       add constraint FKmt44qv8av8abvaqb5nbhjnmi2 
       foreign key (payment_id) 
       references payments (id);

    alter table transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users (id);

    alter table transactions 
       add constraint FK23bop5lktue0o5q7kr19ti8h 
       foreign key (wallet_id) 
       references wallets (id);

    alter table user_relationships 
       add constraint FKq85lfmt4ofyexrumt31rj8r5x 
       foreign key (member_id) 
       references users (id);

    alter table user_relationships 
       add constraint FK4dptlwsivqf9qmatelw8q3lvl 
       foreign key (owner_id) 
       references users (id);

    alter table wallets 
       add constraint FKc1foyisidw7wqqrkamafuwn4e 
       foreign key (user_id) 
       references users (id);

    create table categories (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        icon_name varchar(50),
        name varchar(100) not null,
        description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table payments (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        initiated_by bigint not null,
        source_wallet_id bigint not null,
        updated_at datetime(6) not null,
        destination_type varchar(20) not null,
        payment_method varchar(20) not null,
        payment_status varchar(20) not null,
        destination_identifier varchar(100) not null,
        payment_gateway_reference varchar(100),
        payment_purpose varchar(100),
        transaction_id varchar(100) not null,
        failure_reason varchar(255),
        gateway_response json,
        merchant_name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_actions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        action_type varchar(50) not null,
        action_config json,
        primary key (id)
    ) engine=InnoDB;

    create table rule_conditions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        operator varchar(20) not null,
        condition_type varchar(50) not null,
        value_string varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_violations (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        transaction_id bigint not null,
        violation_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rules (
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint,
        owner_id bigint not null,
        updated_at datetime(6) not null,
        rule_type varchar(50) not null,
        rule_name varchar(100) not null,
        primary key (id)
    ) engine=InnoDB;

    create table transaction_approvals (
        approved_by bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        requested_by bigint not null,
        transaction_id bigint not null,
        updated_at datetime(6) not null,
        status varchar(20) not null,
        approval_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table transactions (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        payment_id bigint,
        updated_at datetime(6) not null,
        user_id bigint not null,
        wallet_id bigint not null,
        status varchar(20) not null,
        upi_reference varchar(100),
        description varchar(255),
        status_reason varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_relationships (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint not null,
        owner_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        date_of_birth date not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        aadhar_number varchar(12) not null,
        phone_number varchar(20) not null,
        email varchar(100) not null,
        name varchar(100) not null,
        password_hash varchar(255) not null,
        role varchar(255) not null,
        username varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table wallets (
        balance decimal(19,4) not null,
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        user_id bigint not null,
        upi_id varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table categories 
       add constraint UKt8o6pivur7nn124jehx7cygw5 unique (name);

    alter table payments 
       add constraint UKlryndveuwa4k5qthti0pkmtlx unique (transaction_id);

    alter table users 
       add constraint UK2hrluauwb53v8e0geuf6iovoe unique (aadhar_number);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);

    alter table wallets 
       add constraint UKsswfdl9fq40xlkove1y5kc7kv unique (user_id);

    alter table wallets 
       add constraint UKtdu4uea1lveiopgmd38yqpmle unique (upi_id);

    alter table payments 
       add constraint FKmuffrx3ov30hi7n6h6vr5ru7i 
       foreign key (category_id) 
       references categories (id);

    alter table payments 
       add constraint FK8mj08peqy83xpb78j5gdc827a 
       foreign key (initiated_by) 
       references users (id);

    alter table payments 
       add constraint FKoqyrt0d6n1mko3bwfskxn7fta 
       foreign key (source_wallet_id) 
       references wallets (id);

    alter table rule_actions 
       add constraint FK9w0ccpgdy8rhix4emgmsjwj1i 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_conditions 
       add constraint FK1c1px9a74wdkeir44qrws5vy0 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FKap6tco67b7f00xw5rbdkji6yg 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FK7gr9nc5744vhb5xqokg4nc10n 
       foreign key (transaction_id) 
       references transactions (id);

    alter table rules 
       add constraint FKfmy9pyjcpliw9wxojmtfh08ed 
       foreign key (member_id) 
       references users (id);

    alter table rules 
       add constraint FKwpn15j7e1lk2372bjjy6beoi 
       foreign key (owner_id) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKaoyupns443pwqefe7mf8c7tir 
       foreign key (approved_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKa38924vp2rkgh1cpw2uj206lb 
       foreign key (requested_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKiytxj19f6gwr144s3a550swe8 
       foreign key (transaction_id) 
       references transactions (id);

    alter table transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories (id);

    alter table transactions 
       add constraint FKmt44qv8av8abvaqb5nbhjnmi2 
       foreign key (payment_id) 
       references payments (id);

    alter table transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users (id);

    alter table transactions 
       add constraint FK23bop5lktue0o5q7kr19ti8h 
       foreign key (wallet_id) 
       references wallets (id);

    alter table user_relationships 
       add constraint FKq85lfmt4ofyexrumt31rj8r5x 
       foreign key (member_id) 
       references users (id);

    alter table user_relationships 
       add constraint FK4dptlwsivqf9qmatelw8q3lvl 
       foreign key (owner_id) 
       references users (id);

    alter table wallets 
       add constraint FKc1foyisidw7wqqrkamafuwn4e 
       foreign key (user_id) 
       references users (id);

    create table categories (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        icon_name varchar(50),
        name varchar(100) not null,
        description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table payments (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        initiated_by bigint not null,
        source_wallet_id bigint not null,
        updated_at datetime(6) not null,
        destination_type varchar(20) not null,
        payment_method varchar(20) not null,
        payment_status varchar(20) not null,
        destination_identifier varchar(100) not null,
        payment_gateway_reference varchar(100),
        payment_purpose varchar(100),
        transaction_id varchar(100) not null,
        failure_reason varchar(255),
        gateway_response json,
        merchant_name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_actions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        action_type varchar(50) not null,
        action_config json,
        primary key (id)
    ) engine=InnoDB;

    create table rule_conditions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        operator varchar(20) not null,
        condition_type varchar(50) not null,
        value_string varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_violations (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        transaction_id bigint not null,
        violation_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rules (
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint,
        owner_id bigint not null,
        updated_at datetime(6) not null,
        rule_type varchar(50) not null,
        rule_name varchar(100) not null,
        primary key (id)
    ) engine=InnoDB;

    create table transaction_approvals (
        approved_by bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        requested_by bigint not null,
        transaction_id bigint not null,
        updated_at datetime(6) not null,
        status varchar(20) not null,
        approval_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table transactions (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        payment_id bigint,
        updated_at datetime(6) not null,
        user_id bigint not null,
        wallet_id bigint not null,
        status varchar(20) not null,
        upi_reference varchar(100),
        description varchar(255),
        status_reason varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_relationships (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint not null,
        owner_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        date_of_birth date not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        aadhar_number varchar(12) not null,
        phone_number varchar(20) not null,
        email varchar(100) not null,
        name varchar(100) not null,
        password_hash varchar(255) not null,
        role varchar(255) not null,
        username varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table wallets (
        balance decimal(19,4) not null,
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        user_id bigint not null,
        upi_id varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table categories 
       add constraint UKt8o6pivur7nn124jehx7cygw5 unique (name);

    alter table payments 
       add constraint UKlryndveuwa4k5qthti0pkmtlx unique (transaction_id);

    alter table users 
       add constraint UK2hrluauwb53v8e0geuf6iovoe unique (aadhar_number);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);

    alter table wallets 
       add constraint UKsswfdl9fq40xlkove1y5kc7kv unique (user_id);

    alter table wallets 
       add constraint UKtdu4uea1lveiopgmd38yqpmle unique (upi_id);

    alter table payments 
       add constraint FKmuffrx3ov30hi7n6h6vr5ru7i 
       foreign key (category_id) 
       references categories (id);

    alter table payments 
       add constraint FK8mj08peqy83xpb78j5gdc827a 
       foreign key (initiated_by) 
       references users (id);

    alter table payments 
       add constraint FKoqyrt0d6n1mko3bwfskxn7fta 
       foreign key (source_wallet_id) 
       references wallets (id);

    alter table rule_actions 
       add constraint FK9w0ccpgdy8rhix4emgmsjwj1i 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_conditions 
       add constraint FK1c1px9a74wdkeir44qrws5vy0 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FKap6tco67b7f00xw5rbdkji6yg 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FK7gr9nc5744vhb5xqokg4nc10n 
       foreign key (transaction_id) 
       references transactions (id);

    alter table rules 
       add constraint FKfmy9pyjcpliw9wxojmtfh08ed 
       foreign key (member_id) 
       references users (id);

    alter table rules 
       add constraint FKwpn15j7e1lk2372bjjy6beoi 
       foreign key (owner_id) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKaoyupns443pwqefe7mf8c7tir 
       foreign key (approved_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKa38924vp2rkgh1cpw2uj206lb 
       foreign key (requested_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKiytxj19f6gwr144s3a550swe8 
       foreign key (transaction_id) 
       references transactions (id);

    alter table transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories (id);

    alter table transactions 
       add constraint FKmt44qv8av8abvaqb5nbhjnmi2 
       foreign key (payment_id) 
       references payments (id);

    alter table transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users (id);

    alter table transactions 
       add constraint FK23bop5lktue0o5q7kr19ti8h 
       foreign key (wallet_id) 
       references wallets (id);

    alter table user_relationships 
       add constraint FKq85lfmt4ofyexrumt31rj8r5x 
       foreign key (member_id) 
       references users (id);

    alter table user_relationships 
       add constraint FK4dptlwsivqf9qmatelw8q3lvl 
       foreign key (owner_id) 
       references users (id);

    alter table wallets 
       add constraint FKc1foyisidw7wqqrkamafuwn4e 
       foreign key (user_id) 
       references users (id);

    create table categories (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        icon_name varchar(50),
        name varchar(100) not null,
        description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table payments (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        initiated_by bigint not null,
        source_wallet_id bigint not null,
        updated_at datetime(6) not null,
        destination_type varchar(20) not null,
        payment_method varchar(20) not null,
        payment_status varchar(20) not null,
        destination_identifier varchar(100) not null,
        payment_gateway_reference varchar(100),
        payment_purpose varchar(100),
        transaction_id varchar(100) not null,
        failure_reason varchar(255),
        gateway_response json,
        merchant_name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_actions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        action_type varchar(50) not null,
        action_config json,
        primary key (id)
    ) engine=InnoDB;

    create table rule_conditions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        operator varchar(20) not null,
        condition_type varchar(50) not null,
        value_string varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_violations (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        transaction_id bigint not null,
        violation_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rules (
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint,
        owner_id bigint not null,
        updated_at datetime(6) not null,
        rule_type varchar(50) not null,
        rule_name varchar(100) not null,
        primary key (id)
    ) engine=InnoDB;

    create table transaction_approvals (
        approved_by bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        requested_by bigint not null,
        transaction_id bigint not null,
        updated_at datetime(6) not null,
        status varchar(20) not null,
        approval_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table transactions (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        payment_id bigint,
        updated_at datetime(6) not null,
        user_id bigint not null,
        wallet_id bigint not null,
        status varchar(20) not null,
        upi_reference varchar(100),
        description varchar(255),
        status_reason varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_relationships (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint not null,
        owner_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        date_of_birth date not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        aadhar_number varchar(12) not null,
        phone_number varchar(20) not null,
        email varchar(100) not null,
        name varchar(100) not null,
        password_hash varchar(255) not null,
        role varchar(255) not null,
        username varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table wallets (
        balance decimal(19,4) not null,
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        user_id bigint not null,
        upi_id varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table categories 
       add constraint UKt8o6pivur7nn124jehx7cygw5 unique (name);

    alter table payments 
       add constraint UKlryndveuwa4k5qthti0pkmtlx unique (transaction_id);

    alter table users 
       add constraint UK2hrluauwb53v8e0geuf6iovoe unique (aadhar_number);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);

    alter table wallets 
       add constraint UKsswfdl9fq40xlkove1y5kc7kv unique (user_id);

    alter table wallets 
       add constraint UKtdu4uea1lveiopgmd38yqpmle unique (upi_id);

    alter table payments 
       add constraint FKmuffrx3ov30hi7n6h6vr5ru7i 
       foreign key (category_id) 
       references categories (id);

    alter table payments 
       add constraint FK8mj08peqy83xpb78j5gdc827a 
       foreign key (initiated_by) 
       references users (id);

    alter table payments 
       add constraint FKoqyrt0d6n1mko3bwfskxn7fta 
       foreign key (source_wallet_id) 
       references wallets (id);

    alter table rule_actions 
       add constraint FK9w0ccpgdy8rhix4emgmsjwj1i 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_conditions 
       add constraint FK1c1px9a74wdkeir44qrws5vy0 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FKap6tco67b7f00xw5rbdkji6yg 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FK7gr9nc5744vhb5xqokg4nc10n 
       foreign key (transaction_id) 
       references transactions (id);

    alter table rules 
       add constraint FKfmy9pyjcpliw9wxojmtfh08ed 
       foreign key (member_id) 
       references users (id);

    alter table rules 
       add constraint FKwpn15j7e1lk2372bjjy6beoi 
       foreign key (owner_id) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKaoyupns443pwqefe7mf8c7tir 
       foreign key (approved_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKa38924vp2rkgh1cpw2uj206lb 
       foreign key (requested_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKiytxj19f6gwr144s3a550swe8 
       foreign key (transaction_id) 
       references transactions (id);

    alter table transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories (id);

    alter table transactions 
       add constraint FKmt44qv8av8abvaqb5nbhjnmi2 
       foreign key (payment_id) 
       references payments (id);

    alter table transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users (id);

    alter table transactions 
       add constraint FK23bop5lktue0o5q7kr19ti8h 
       foreign key (wallet_id) 
       references wallets (id);

    alter table user_relationships 
       add constraint FKq85lfmt4ofyexrumt31rj8r5x 
       foreign key (member_id) 
       references users (id);

    alter table user_relationships 
       add constraint FK4dptlwsivqf9qmatelw8q3lvl 
       foreign key (owner_id) 
       references users (id);

    alter table wallets 
       add constraint FKc1foyisidw7wqqrkamafuwn4e 
       foreign key (user_id) 
       references users (id);

    create table categories (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        icon_name varchar(50),
        name varchar(100) not null,
        description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table payments (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        initiated_by bigint not null,
        source_wallet_id bigint not null,
        updated_at datetime(6) not null,
        destination_type varchar(20) not null,
        payment_method varchar(20) not null,
        payment_status varchar(20) not null,
        destination_identifier varchar(100) not null,
        payment_gateway_reference varchar(100),
        payment_purpose varchar(100),
        transaction_id varchar(100) not null,
        failure_reason varchar(255),
        gateway_response json,
        merchant_name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_actions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        action_type varchar(50) not null,
        action_config json,
        primary key (id)
    ) engine=InnoDB;

    create table rule_conditions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        operator varchar(20) not null,
        condition_type varchar(50) not null,
        value_string varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_violations (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        transaction_id bigint not null,
        violation_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rules (
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint,
        owner_id bigint not null,
        updated_at datetime(6) not null,
        rule_type varchar(50) not null,
        rule_name varchar(100) not null,
        primary key (id)
    ) engine=InnoDB;

    create table transaction_approvals (
        approved_by bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        requested_by bigint not null,
        transaction_id bigint not null,
        updated_at datetime(6) not null,
        status varchar(20) not null,
        approval_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table transactions (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        payment_id bigint,
        updated_at datetime(6) not null,
        user_id bigint not null,
        wallet_id bigint not null,
        status varchar(20) not null,
        upi_reference varchar(100),
        description varchar(255),
        status_reason varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_relationships (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint not null,
        owner_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        date_of_birth date not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        aadhar_number varchar(12) not null,
        phone_number varchar(20) not null,
        email varchar(100) not null,
        name varchar(100) not null,
        password_hash varchar(255) not null,
        role varchar(255) not null,
        username varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table wallets (
        balance decimal(19,4) not null,
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        user_id bigint not null,
        upi_id varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table categories 
       add constraint UKt8o6pivur7nn124jehx7cygw5 unique (name);

    alter table payments 
       add constraint UKlryndveuwa4k5qthti0pkmtlx unique (transaction_id);

    alter table users 
       add constraint UK2hrluauwb53v8e0geuf6iovoe unique (aadhar_number);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);

    alter table wallets 
       add constraint UKsswfdl9fq40xlkove1y5kc7kv unique (user_id);

    alter table wallets 
       add constraint UKtdu4uea1lveiopgmd38yqpmle unique (upi_id);

    alter table payments 
       add constraint FKmuffrx3ov30hi7n6h6vr5ru7i 
       foreign key (category_id) 
       references categories (id);

    alter table payments 
       add constraint FK8mj08peqy83xpb78j5gdc827a 
       foreign key (initiated_by) 
       references users (id);

    alter table payments 
       add constraint FKoqyrt0d6n1mko3bwfskxn7fta 
       foreign key (source_wallet_id) 
       references wallets (id);

    alter table rule_actions 
       add constraint FK9w0ccpgdy8rhix4emgmsjwj1i 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_conditions 
       add constraint FK1c1px9a74wdkeir44qrws5vy0 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FKap6tco67b7f00xw5rbdkji6yg 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FK7gr9nc5744vhb5xqokg4nc10n 
       foreign key (transaction_id) 
       references transactions (id);

    alter table rules 
       add constraint FKfmy9pyjcpliw9wxojmtfh08ed 
       foreign key (member_id) 
       references users (id);

    alter table rules 
       add constraint FKwpn15j7e1lk2372bjjy6beoi 
       foreign key (owner_id) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKaoyupns443pwqefe7mf8c7tir 
       foreign key (approved_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKa38924vp2rkgh1cpw2uj206lb 
       foreign key (requested_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKiytxj19f6gwr144s3a550swe8 
       foreign key (transaction_id) 
       references transactions (id);

    alter table transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories (id);

    alter table transactions 
       add constraint FKmt44qv8av8abvaqb5nbhjnmi2 
       foreign key (payment_id) 
       references payments (id);

    alter table transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users (id);

    alter table transactions 
       add constraint FK23bop5lktue0o5q7kr19ti8h 
       foreign key (wallet_id) 
       references wallets (id);

    alter table user_relationships 
       add constraint FKq85lfmt4ofyexrumt31rj8r5x 
       foreign key (member_id) 
       references users (id);

    alter table user_relationships 
       add constraint FK4dptlwsivqf9qmatelw8q3lvl 
       foreign key (owner_id) 
       references users (id);

    alter table wallets 
       add constraint FKc1foyisidw7wqqrkamafuwn4e 
       foreign key (user_id) 
       references users (id);

    create table categories (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        icon_name varchar(50),
        name varchar(100) not null,
        description varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table payments (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        initiated_by bigint not null,
        source_wallet_id bigint not null,
        updated_at datetime(6) not null,
        destination_type varchar(20) not null,
        payment_method varchar(20) not null,
        payment_status varchar(20) not null,
        destination_identifier varchar(100) not null,
        payment_gateway_reference varchar(100),
        payment_purpose varchar(100),
        transaction_id varchar(100) not null,
        failure_reason varchar(255),
        gateway_response json,
        merchant_name varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_actions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        action_type varchar(50) not null,
        action_config json,
        primary key (id)
    ) engine=InnoDB;

    create table rule_conditions (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        operator varchar(20) not null,
        condition_type varchar(50) not null,
        value_string varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rule_violations (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        rule_id bigint not null,
        transaction_id bigint not null,
        violation_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table rules (
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint,
        owner_id bigint not null,
        updated_at datetime(6) not null,
        rule_type varchar(50) not null,
        rule_name varchar(100) not null,
        primary key (id)
    ) engine=InnoDB;

    create table transaction_approvals (
        approved_by bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        requested_by bigint not null,
        transaction_id bigint not null,
        updated_at datetime(6) not null,
        status varchar(20) not null,
        approval_notes varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table transactions (
        amount decimal(19,4) not null,
        category_id bigint,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        payment_id bigint,
        updated_at datetime(6) not null,
        user_id bigint not null,
        wallet_id bigint not null,
        status varchar(20) not null,
        upi_reference varchar(100),
        description varchar(255),
        status_reason varchar(255),
        primary key (id)
    ) engine=InnoDB;

    create table user_relationships (
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        member_id bigint not null,
        owner_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        date_of_birth date not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        aadhar_number varchar(12) not null,
        phone_number varchar(20) not null,
        email varchar(100) not null,
        name varchar(100) not null,
        password_hash varchar(255) not null,
        role varchar(255) not null,
        username varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table wallets (
        balance decimal(19,4) not null,
        is_active bit not null,
        created_at datetime(6) not null,
        id bigint not null auto_increment,
        updated_at datetime(6) not null,
        user_id bigint not null,
        upi_id varchar(50) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table categories 
       add constraint UKt8o6pivur7nn124jehx7cygw5 unique (name);

    alter table payments 
       add constraint UKlryndveuwa4k5qthti0pkmtlx unique (transaction_id);

    alter table users 
       add constraint UK2hrluauwb53v8e0geuf6iovoe unique (aadhar_number);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UKr43af9ap4edm43mmtq01oddj6 unique (username);

    alter table wallets 
       add constraint UKsswfdl9fq40xlkove1y5kc7kv unique (user_id);

    alter table wallets 
       add constraint UKtdu4uea1lveiopgmd38yqpmle unique (upi_id);

    alter table payments 
       add constraint FKmuffrx3ov30hi7n6h6vr5ru7i 
       foreign key (category_id) 
       references categories (id);

    alter table payments 
       add constraint FK8mj08peqy83xpb78j5gdc827a 
       foreign key (initiated_by) 
       references users (id);

    alter table payments 
       add constraint FKoqyrt0d6n1mko3bwfskxn7fta 
       foreign key (source_wallet_id) 
       references wallets (id);

    alter table rule_actions 
       add constraint FK9w0ccpgdy8rhix4emgmsjwj1i 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_conditions 
       add constraint FK1c1px9a74wdkeir44qrws5vy0 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FKap6tco67b7f00xw5rbdkji6yg 
       foreign key (rule_id) 
       references rules (id);

    alter table rule_violations 
       add constraint FK7gr9nc5744vhb5xqokg4nc10n 
       foreign key (transaction_id) 
       references transactions (id);

    alter table rules 
       add constraint FKfmy9pyjcpliw9wxojmtfh08ed 
       foreign key (member_id) 
       references users (id);

    alter table rules 
       add constraint FKwpn15j7e1lk2372bjjy6beoi 
       foreign key (owner_id) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKaoyupns443pwqefe7mf8c7tir 
       foreign key (approved_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKa38924vp2rkgh1cpw2uj206lb 
       foreign key (requested_by) 
       references users (id);

    alter table transaction_approvals 
       add constraint FKiytxj19f6gwr144s3a550swe8 
       foreign key (transaction_id) 
       references transactions (id);

    alter table transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories (id);

    alter table transactions 
       add constraint FKmt44qv8av8abvaqb5nbhjnmi2 
       foreign key (payment_id) 
       references payments (id);

    alter table transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users (id);

    alter table transactions 
       add constraint FK23bop5lktue0o5q7kr19ti8h 
       foreign key (wallet_id) 
       references wallets (id);

    alter table user_relationships 
       add constraint FKq85lfmt4ofyexrumt31rj8r5x 
       foreign key (member_id) 
       references users (id);

    alter table user_relationships 
       add constraint FK4dptlwsivqf9qmatelw8q3lvl 
       foreign key (owner_id) 
       references users (id);

    alter table wallets 
       add constraint FKc1foyisidw7wqqrkamafuwn4e 
       foreign key (user_id) 
       references users (id);
