package implementation

import (
	"errors"
	"log"
	"lottoshared/sharedmodel"
	"lottoussd/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type SqlLayer struct {
	Session *gorm.DB
	Agent   *gorm.DB
	Admin   *gorm.DB
}

func NewSqlLayer(dsn, agentDsn, adminDsn string) *SqlLayer {
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	agentDb, err := gorm.Open(mysql.Open(agentDsn), &gorm.Config{})

	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}

	adminDb, err := gorm.Open(mysql.Open(adminDsn), &gorm.Config{})

	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}

	return &SqlLayer{Session: db, Agent: agentDb, Admin: adminDb}
}

func (sql *SqlLayer) CreateAccount(user *sharedmodel.Account) (string, error) {
	err := sql.Session.Create(&user).Error
	if err != nil {
		return "", err
	}
	return user.MSISDN, err
}

func (sql *SqlLayer) CreateVBatch(vb *models.VBatch) (string, error) {
	err := sql.Session.Create(&vb).Error
	if err != nil {
		return "", err
	}
	return vb.ID, err
}

func (sql *SqlLayer) FindAccount(arg *sharedmodel.Account) (*sharedmodel.Account, error) {
	session := sql.Session
	var dA sharedmodel.Account
	err := session.Where(arg).First(&dA).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound
	}
	if err != nil {
		return nil, err
	}
	return &dA, err
}

func (sql *SqlLayer) FindAgent(arg *sharedmodel.Agent) (*sharedmodel.Agent, error) {
	session := sql.Agent
	var dA sharedmodel.Agent
	err := session.Where(arg).First(&dA).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound
	}
	if err != nil {
		return nil, err
	}
	return &dA, err
}

func (sql *SqlLayer) FindAgentWallet(arg *sharedmodel.Wallet) (*sharedmodel.Wallet, error) {
	session := sql.Agent
	var dA sharedmodel.Wallet
	err := session.Where(arg).First(&dA).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound
	}
	if err != nil {
		return nil, err
	}
	return &dA, err
}

func (sql *SqlLayer) UpdateUser(old *sharedmodel.Account, new *sharedmodel.Account) error {
	session := sql.Session
	return session.Model(&old).Updates(new).Error
}

func (sql *SqlLayer) UpdateUserMap(arg *sharedmodel.Account, dict map[string]interface{}) error {
	session := sql.Session
	return session.Model(&arg).Updates(dict).Error
}

func (sql *SqlLayer) UpdateAgent(old *sharedmodel.Agent, new *sharedmodel.Agent) error {
	session := sql.Agent
	return session.Model(&old).Updates(new).Error
}

func (sql *SqlLayer) UpdateAgentMap(arg *sharedmodel.Agent, dict map[string]interface{}) error {
	session := sql.Agent
	return session.Model(&arg).Updates(dict).Error
}

func (sql *SqlLayer) CreateWinning(wins *sharedmodel.Winnings) (string, error) {
	err := sql.Session.Create(&wins).Error
	if err != nil {
		return "", err
	}
	return wins.Hash, err
}

func (sql *SqlLayer) CreateTransaction(wins *sharedmodel.Transaction) (string, error) {
	err := sql.Agent.Create(&wins).Error
	if err != nil {
		return "", err
	}
	return wins.Id, err
}

func (sql *SqlLayer) CreateGameLog(game *sharedmodel.GameEntry) error {
	err := sql.Session.Create(&game).Error
	if err != nil {
		return err
	}
	return err
}

func (sql *SqlLayer) FindWinning(arg *sharedmodel.Winnings) (*sharedmodel.Winnings, error) {
	session := sql.Session
	var dA sharedmodel.Winnings
	err := session.Where(arg).First(&dA).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound
	}
	if err != nil {
		return nil, err
	}
	return &dA, err
}

func (sql *SqlLayer) UpdateWinning(old *sharedmodel.Winnings, new *sharedmodel.Winnings) error {
	session := sql.Session
	return session.Model(&old).Updates(new).Error
}

func (sql *SqlLayer) UpdateWinningMap(arg *sharedmodel.Winnings, dict map[string]interface{}) error {
	session := sql.Session
	return session.Model(&arg).Updates(dict).Error
}

func (sql *SqlLayer) CreateVoucher(wins *sharedmodel.Voucher) (string, error) {
	err := sql.Session.Create(&wins).Error
	if err != nil {
		return "", err
	}
	return wins.Hash, err
}

func (sql *SqlLayer) FindVoucher(arg *sharedmodel.Voucher) (*sharedmodel.Voucher, error) {
	session := sql.Session
	var dA sharedmodel.Voucher
	err := session.Where(arg).First(&dA).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound
	}
	if err != nil {
		return nil, err
	}
	return &dA, err
}

func (sql *SqlLayer) UpdateVoucher(old *sharedmodel.Voucher, new *sharedmodel.Voucher) error {
	session := sql.Session
	return session.Model(&old).Updates(new).Error
}

func (sql *SqlLayer) UpdateVoucherMap(arg *sharedmodel.Voucher, dict map[string]interface{}) error {
	session := sql.Session
	return session.Model(&arg).Updates(dict).Error
}

func (sql *SqlLayer) FindScratchGame(id string) (*models.ScratchPlayDenominations, error) {
	session := sql.Admin
	var result models.ScratchPlayDenominations
	err := session.Where(&models.ScratchPlayDenominations{ID: id}).First(&result).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound

	}

	if err != nil {
		return nil, err
	}

	return &result, nil
}
