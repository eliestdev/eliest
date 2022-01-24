package implement

import (
	"errors"
	"fmt"
	"lottoagent/models"
	"lottoshared/constants"
	"lottoshared/helpers"
	"lottoshared/sharedmodel"

	"github.com/twinj/uuid"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type SqlLayer struct {
	Session *gorm.DB
	USSD    *gorm.DB
	Admin   *gorm.DB
	Finance *gorm.DB
}

func NewSqlLayer(addr, ussd, admin, finance string) *SqlLayer {
	db, err := gorm.Open(mysql.Open(addr), &gorm.Config{})

	if err != nil {
		fmt.Errorf("FAILED TO OPEN DB: %v", err)
	}

	ussddb, err := gorm.Open(mysql.Open(ussd), &gorm.Config{})

	if err != nil {
		fmt.Errorf("failed to open database: %v", err)
	}

	admindb, err := gorm.Open(mysql.Open(admin), &gorm.Config{})

	if err != nil {
		fmt.Errorf("failed to open Admin database: %v", err)
	}

	findb, err := gorm.Open(mysql.Open(finance), &gorm.Config{})
	if err != nil {
		fmt.Errorf("failed to open Finance database: %v", err)
	}

	return &SqlLayer{Session: db, USSD: ussddb, Admin: admindb, Finance: findb}
}

func (sql *SqlLayer) FindAccount(user *sharedmodel.Account) (*sharedmodel.Account, error) {
	session := sql.USSD
	var dUser sharedmodel.Account

	err := session.Where(user).First(&dUser).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound
	}
	return &dUser, err
}

func (sql *SqlLayer) CreateAccount(user *sharedmodel.Account) error {
	session := sql.Session
	return session.Create(&user).Error
}

func (sql *SqlLayer) UpdateUser(old *sharedmodel.Account, new *sharedmodel.Account) error {
	session := sql.USSD
	return session.Model(&old).Updates(new).Error
}

func (sql *SqlLayer) UpdateUserMap(arg *sharedmodel.Account, dict map[string]interface{}) error {
	session := sql.USSD
	return session.Model(&arg).Updates(dict).Error
}

func (sql *SqlLayer) UpdateAccount(user *sharedmodel.Account, data sharedmodel.Account) error {
	session := sql.USSD
	return session.Model(&user).Updates(data).Error
}

// UpdateAccountMap
func (sql *SqlLayer) UpdateAccountMap(user *sharedmodel.Account, dict map[string]interface{}) error {
	session := sql.USSD
	return session.Model(&user).Updates(dict).Error
}

// Run
func (sql *SqlLayer) Run(query string) error {
	session := sql.Session
	return session.Exec(query).Error
}

func (sql *SqlLayer) CreateVoucher(v *sharedmodel.Voucher) error {
	session := sql.Session
	return session.Create(&v).Error
}

func (sql *SqlLayer) FindVoucher(v *sharedmodel.Voucher) (sharedmodel.Voucher, error) {
	session := sql.Session
	var dV sharedmodel.Voucher

	if errors.Is(session.Where(v).First(&dV).Error, gorm.ErrRecordNotFound) {
		return dV, gorm.ErrRecordNotFound
	}
	return dV, nil
}

func (sql *SqlLayer) FindAgents(arg string) ([]sharedmodel.Agent, error) {
	args := sharedmodel.Agent{Referrer: arg}
	session := sql.Session
	var dtV []sharedmodel.Agent

	err := session.Where(&args).Find(&dtV).Error
	if err != nil {
		return nil, err
	}
	return dtV, nil
}

func (sql *SqlLayer) IFindAgents(arg map[string]interface{}) ([]sharedmodel.Agent, error) {
	session := sql.Session
	var results []sharedmodel.Agent

	err := session.Where(arg).Order("created_at").Find(&results).Error
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (sql *SqlLayer) IFindAgent(arg map[string]interface{}) (*sharedmodel.Agent, error) {
	session := sql.Session
	var results sharedmodel.Agent
	err := session.Where(arg).Order("created_at").Find(&results).Error
	if err != nil {
		return nil, err
	}
	return &results, nil
}

func (sql *SqlLayer) FindVBatch(arg string) ([]models.VBatch, error) {
	args := models.VBatch{Owner: arg}
	session := sql.USSD
	var dtV []models.VBatch

	err := session.Where(&args).Order("timeline desc").Find(&dtV).Error
	if err != nil {
		return nil, err
	}
	return dtV, nil
}

func (sql *SqlLayer) FindBVouchers(arg string) ([]sharedmodel.Voucher, error) {
	args := sharedmodel.Voucher{Batch: arg}
	session := sql.USSD
	var dtV []sharedmodel.Voucher

	err := session.Where(&args).Order("created_at").Find(&dtV).Error
	if err != nil {
		return nil, err
	}
	return dtV, nil
}

func (sql *SqlLayer) GenerateVouchers(amount []int, length int, by string) ([]sharedmodel.Voucher, string, error) {
	session := sql.USSD
	var dTs []sharedmodel.Voucher

	batch, err := sql.CreateVBatch(&models.VBatch{ID: uuid.NewV4().String(), Timeline: helpers.CreatedAt(), Owner: by})
	if err != nil {
		return dTs, "", err
	}
	for i := 0; i < len(amount); i++ {
		var vocher = sharedmodel.GererateVoucher(float64(amount[i]), by, batch, length)
		dTs = append(dTs, vocher)
	}
	err = session.Create(&dTs).Error
	return dTs, batch, err
}

func (sql *SqlLayer) CreateVBatch(vb *models.VBatch) (string, error) {
	err := sql.USSD.Create(&vb).Error
	if err != nil {
		return "", err
	}
	return vb.ID, err
}

func (sql *SqlLayer) FindGame(game *models.Game) (models.Game, error) {
	session := sql.Session
	dGame := models.Game{}

	if errors.Is(session.Where(game).First(&dGame).Error, gorm.ErrRecordNotFound) {
		return dGame, gorm.ErrRecordNotFound
	}
	return dGame, nil
}

func (sql *SqlLayer) AllAgents() ([]*sharedmodel.Agent, error) {
	session := sql.Session
	var as []*sharedmodel.Agent
	err := session.Find(&as).Error
	return as, err
}

func (sql *SqlLayer) CreateWinning(w *sharedmodel.Winnings) (string, error) {
	session := sql.Session
	err := session.Create(&w).Error
	if err != nil {
		return "", err
	}
	return w.Hash, err
}

func (sql *SqlLayer) CreateAgent(a *sharedmodel.Agent) (string, error) {
	session := sql.Session
	return a.Id, session.Create(&a).Error
}

func (sql *SqlLayer) CreateWallet(w *sharedmodel.Wallet) (string, error) {
	session := sql.Session
	err := session.Create(&w).Error
	if err != nil {
		return "", err
	}
	return w.Id, err
}

func (sql *SqlLayer) CreateTransaction(t *sharedmodel.Transaction) (string, error) {
	session := sql.Session
	err := session.Create(&t).Error
	if err != nil {
		return "", err
	}
	return t.Id, err
}

func (sql *SqlLayer) FindWinning(w *sharedmodel.Winnings) (*sharedmodel.Winnings, error) {
	session := sql.USSD
	var dW sharedmodel.Winnings

	if errors.Is(session.Where(w).First(&dW).Error, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound
	}
	return &dW, nil
}

func (sql *SqlLayer) FindAgent(a *sharedmodel.Agent) (*sharedmodel.Agent, error) {
	session := sql.Session
	var dA sharedmodel.Agent
	err := session.Where(a).First(&dA).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound
	}
	if err != nil {
		return nil, err
	}
	return &dA, err
}

func (sql *SqlLayer) FindSupervisor(a *sharedmodel.Supervisor) (*sharedmodel.Supervisor, error) {
	session := sql.Session
	var dA sharedmodel.Supervisor
	err := session.Where(a).First(&dA).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound
	}
	if err != nil {
		return nil, err
	}
	return &dA, err
}

func (sql *SqlLayer) UpdateWinning(w *sharedmodel.Winnings, dict map[string]interface{}) error {
	session := sql.USSD
	return session.Model(&w).Updates(dict).Error
}

// UpdateVoucher
func (sql *SqlLayer) UpdateVoucher(v *sharedmodel.Voucher, dict map[string]interface{}) error {
	session := sql.Session
	return session.Model(&v).Updates(dict).Error
}

// UpdateVoucher
func (sql *SqlLayer) UpdateAgent(a *sharedmodel.Agent, b *sharedmodel.Agent) error {
	session := sql.Session
	return session.Model(&a).Updates(b).Error
}

// UpdateVoucher
func (sql *SqlLayer) UpdateAgentMap(a *sharedmodel.Agent, dict map[string]interface{}) error {
	session := sql.Session
	return session.Model(&a).Updates(dict).Error
}

// UpdateVoucher
func (sql *SqlLayer) UpdateWallet(w *sharedmodel.Wallet, dict map[string]interface{}) error {
	session := sql.Session
	return session.Model(&w).Updates(dict).Error
}

func (sql *SqlLayer) FindWinningTransactions(winningWalletId string) ([]sharedmodel.Transaction, error) {
	session := sql.Finance
	args := sharedmodel.Transaction{Description: constants.WINNINGDECS, Destination: winningWalletId}
	var dTs []sharedmodel.Transaction

	err := session.Where(&args).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) FindTransaction(t *sharedmodel.Transaction) (sharedmodel.Transaction, error) {
	session := sql.Session
	var dT sharedmodel.Transaction

	if errors.Is(session.Where(t).First(&dT).Error, gorm.ErrRecordNotFound) {
		return dT, gorm.ErrRecordNotFound
	}
	return dT, nil
}

func (sql *SqlLayer) FindTransactions(t string) ([]sharedmodel.Transaction, error) {
	args := sharedmodel.Transaction{Account: t}
	session := sql.Session
	var dTs []sharedmodel.Transaction

	err := session.Where(&args).Order("created_at").Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) CreateTarget(v *sharedmodel.AgentTargetAssignment) (uint, error) {
	session := sql.Session
	err := session.Create(&v).Error
	return v.ID, err
}

func (sql *SqlLayer) GetTarget(v *sharedmodel.AgentTargetAssignment) (sharedmodel.AgentTargetAssignment, error) {
	session := sql.Session
	var dV sharedmodel.AgentTargetAssignment

	if errors.Is(session.Where(v).First(&dV).Error, gorm.ErrRecordNotFound) {
		return dV, gorm.ErrRecordNotFound
	}
	return dV, nil
}

func (sql *SqlLayer) DeleteTarget(v *sharedmodel.AgentTargetAssignment) (sharedmodel.AgentTargetAssignment, error) {
	session := sql.Session
	var dV sharedmodel.AgentTargetAssignment

	if errors.Is(session.Where(v).Delete(&dV).Error, gorm.ErrRecordNotFound) {
		return dV, gorm.ErrRecordNotFound
	}
	return dV, nil
}

func (sql *SqlLayer) GetTargets(v *sharedmodel.AgentTargetAssignment) ([]sharedmodel.AgentTargetAssignment, error) {
	args := sharedmodel.AgentTargetAssignment{AgentId: v.AgentId}
	session := sql.Session
	var dTs []sharedmodel.AgentTargetAssignment

	err := session.Where(&args).Order("created_at").Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) UpdateTarget(a *sharedmodel.AgentTargetAssignment, dict map[string]interface{}) error {
	session := sql.Session
	return session.Model(&a).Updates(dict).Error
}

func (sql *SqlLayer) UpdateTargetWithModel(old, newChanges *sharedmodel.AgentTargetAssignment) error {
	session := sql.Session
	return session.Model(&old).Updates(newChanges).Error
}

func (sql *SqlLayer) CreateReferral(v *sharedmodel.AgentReferalls) (uint, error) {
	session := sql.Session
	err := session.Create(&v).Error
	return v.ID, err
}

func (sql *SqlLayer) GetReferrals(refCode string, start, end int64) ([]sharedmodel.AgentReferalls, error) {
	session := sql.Session
	var dTs []sharedmodel.AgentReferalls
	err := session.Where("ref_code = ? AND created_at >= ? AND created_at <= ?", refCode, start, end).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) GetDenominations() ([]models.ScratchPlayDenominations, error) {
	session := sql.Admin
	option := models.ScratchPlayDenominations{}

	var result []models.ScratchPlayDenominations

	err := session.Where(option).Find(&result).Error

	if err != nil {
		return nil, err
	}

	return result, err
}

func (sql *SqlLayer) FindGlobalTargets() ([]models.AgentsTargetInformation, error) {
	session := sql.Admin
	option := models.AgentsTargetInformation{}

	var result []models.AgentsTargetInformation

	err := session.Where(option).Find(&result).Error

	if err != nil {
		return nil, err
	}

	return result, err
}
