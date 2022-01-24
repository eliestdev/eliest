package implement

import (
	"errors"
	"log"
	"lottoshared/constants"
	"lottoshared/sharedmodel"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type SqlLayer struct {
	FinanceDb *gorm.DB
}

func NewSqlLayer(finance string) *SqlLayer {
	financeDb, err := gorm.Open(mysql.Open(finance), &gorm.Config{})
	if err != nil {
		log.Printf("FAILED TO OPEN DATABASE: %v", err)
	}
	return &SqlLayer{FinanceDb: financeDb}
}

func (sql *SqlLayer) CreateWallet(wallet *sharedmodel.Wallet) (string, error) {
	session := sql.FinanceDb
	err := session.Create(&wallet).Error
	if err != nil {
		return "", err
	}
	return wallet.Id, err
}

func (sql *SqlLayer) CreateTransaction(transaction *sharedmodel.Transaction) (string, error) {
	session := sql.FinanceDb
	err := session.Create(&transaction).Error
	if err != nil {
		return "", err
	}
	return transaction.Id, err
}

func (sql *SqlLayer) GetWallet(arg *sharedmodel.Wallet) (sharedmodel.WalletQuery, error) {
	session := sql.FinanceDb
	var wallet sharedmodel.Wallet
	var result sharedmodel.WalletQuery
	err := session.Where(arg).First(&wallet).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return result, gorm.ErrRecordNotFound
	}
	transactions, err := sql.FindTransactions(map[string]interface{}{"account": arg.Id})
	if err != nil {
		return result, err
	}
	result.Info = wallet
	result.Transactions = transactions

	return result, err
}

func (sql *SqlLayer) FindWallet(arg *sharedmodel.Wallet) (sharedmodel.Wallet, error) {
	session := sql.FinanceDb
	var result sharedmodel.Wallet
	err := session.Where(arg).First(&result).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return result, gorm.ErrRecordNotFound
	}
	if err != nil {
		return result, err
	}
	return result, err
}

func (sql *SqlLayer) FindTransaction(t *sharedmodel.Transaction) (sharedmodel.Transaction, error) {
	session := sql.FinanceDb
	var result sharedmodel.Transaction
	if errors.Is(session.Where(t).Order("created_at DESC").First(&result).Error, gorm.ErrRecordNotFound) {
		return result, gorm.ErrRecordNotFound
	}
	return result, nil
}

func (sql *SqlLayer) FindAllTransactions(t *sharedmodel.Transaction) ([]sharedmodel.Transaction, error) {
	session := sql.FinanceDb
	var result []sharedmodel.Transaction
	if errors.Is(session.Where(t).Order("created_at DESC").Find(&result).Error, gorm.ErrRecordNotFound) {
		return result, gorm.ErrRecordNotFound
	}
	return result, nil
}

func (sql *SqlLayer) FindHeavierTransaction(t *sharedmodel.Transaction) (sharedmodel.Transaction, error) {
	session := sql.FinanceDb
	var result sharedmodel.Transaction
	if errors.Is(session.Where(t).Order("amount DESC").First(&result).Error, gorm.ErrRecordNotFound) {
		return result, gorm.ErrRecordNotFound
	}
	return result, nil
}

func (sql *SqlLayer) FindWallets(arg map[string]interface{}) ([]sharedmodel.Wallet, error) {
	session := sql.FinanceDb
	var results []sharedmodel.Wallet
	err := session.Where(arg).Order("created_at").Find(&results).Error
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (sql *SqlLayer) FindTransactions(arg map[string]interface{}) ([]sharedmodel.Transaction, error) {
	session := sql.FinanceDb
	var results []sharedmodel.Transaction
	rangemap := make(map[string]interface{}, 2)
	if _, ok := arg["from"]; !ok {
		rangemap["from"] = constants.LONGAGO
		rangemap["to"] = constants.FARAWAY
	} else {
		rangemap["account"] = arg["account"]
		rangemap["from"] = arg["from"]
		rangemap["to"] = arg["to"]
		delete(arg, "from")
		delete(arg, "to")
	}
	log.Println(rangemap)
	log.Println(arg)
	err := session.Where(arg).Where("created_at >= ? AND created_at <= ?", rangemap["from"], rangemap["to"]).Find(&results).Error
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (sql *SqlLayer) FindRecentTransactions(arg map[string]interface{}) ([]sharedmodel.Transaction, error) {
	session := sql.FinanceDb
	var results []sharedmodel.Transaction
	rangemap := make(map[string]interface{}, 2)
	if _, ok := arg["from"]; !ok {
		rangemap["from"] = constants.LONGAGO
		rangemap["to"] = constants.FARAWAY
	} else {

		rangemap["from"] = arg["from"]
		rangemap["to"] = arg["to"]
		delete(arg, "from")
		delete(arg, "to")
	}
	log.Println(rangemap)
	log.Println(arg)
	err := session.Where(arg).Where("created_at >= ? AND created_at <= ?", rangemap["from"], rangemap["to"]).Order("created_at desc").Find(&results).Error
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (sql *SqlLayer) UpdateWallet(old, new *sharedmodel.Wallet) error {
	session := sql.FinanceDb
	return session.Model(&old).Updates(new).Error
}

func (sql *SqlLayer) UpdateWalletMap(w *sharedmodel.Wallet, arg map[string]interface{}) error {
	session := sql.FinanceDb
	return session.Model(&w).Updates(arg).Error
}

func (sql *SqlLayer) UpdateTransaction(w *sharedmodel.Transaction, arg map[string]interface{}) error {
	session := sql.FinanceDb
	return session.Model(&w).Updates(arg).Error
}
