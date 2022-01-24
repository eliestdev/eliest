package implement

import (
	"errors"
	"fmt"
	"lottoadmin/models"
	"lottoshared/sharedmodel"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type SqlLayer struct {
	AgentDb    *gorm.DB
	USSD       *gorm.DB
	Supervisor *gorm.DB
	AdminDB    *gorm.DB
	FinanceDB  *gorm.DB
}

func NewSqlLayer(addr, ussd, supervisors, admin, finance string) *SqlLayer {
	db, err := gorm.Open(mysql.Open(addr), &gorm.Config{})

	if err != nil {
		fmt.Errorf("failed to open database: %v", err)
	}

	ussddb, err := gorm.Open(mysql.Open(ussd), &gorm.Config{})

	if err != nil {
		fmt.Errorf("failed to open database: %v", err)
	}

	supervisorDb, err := gorm.Open(mysql.Open(supervisors), &gorm.Config{})
	if err != nil {
		fmt.Errorf("failed to open database: %v", err)
	}

	adminDb, err := gorm.Open(mysql.Open(admin), &gorm.Config{})
	if err != nil {
		fmt.Errorf("failed to open database: %v", err)
	}

	financeDb, err := gorm.Open(mysql.Open(finance), &gorm.Config{})
	if err != nil {
		fmt.Errorf("failed to open database: %v", err)
	}
	return &SqlLayer{AgentDb: db, USSD: ussddb, Supervisor: supervisorDb, AdminDB: adminDb, FinanceDB: financeDb}
}

func (sql *SqlLayer) CreateAdmin(w *sharedmodel.AdminAccount) (string, error) {
	session := sql.AdminDB
	err := session.Create(&w).Error
	if err != nil {
		return "", err
	}
	return w.Id, err
}

func (sql *SqlLayer) AuthenticateAdmin(w *sharedmodel.AdminAccount) (*sharedmodel.AdminAccount, error) {
	session := sql.AdminDB
	var dT sharedmodel.AdminAccount

	if errors.Is(session.Where(w).First(&dT).Error, gorm.ErrRecordNotFound) {
		return nil, gorm.ErrRecordNotFound
	}
	return &dT, nil
}

func (sql *SqlLayer) CreateTarget(w *sharedmodel.SupervisorTarget) (string, error) {
	session := sql.Supervisor
	err := session.Create(&w).Error
	if err != nil {
		return "", err
	}
	return w.Id, err
}

func (sql *SqlLayer) CreateTargetAssignment(w *sharedmodel.TargetAssignment) (string, error) {
	session := sql.Supervisor
	err := session.Create(&w).Error
	if err != nil {
		return "", err
	}
	return w.Id, err
}

func (sql *SqlLayer) GetAllTargets() ([]sharedmodel.SupervisorTarget, error) {
	session := sql.Supervisor
	var dTs []sharedmodel.SupervisorTarget

	err := session.Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) FindTransaction(t *sharedmodel.Transaction) (sharedmodel.Transaction, error) {
	session := sql.AgentDb
	var dT sharedmodel.Transaction

	if errors.Is(session.Where(t).First(&dT).Error, gorm.ErrRecordNotFound) {
		return dT, gorm.ErrRecordNotFound
	}
	return dT, nil
}

func (sql *SqlLayer) FindTransactions(t string) ([]sharedmodel.Transaction, error) {
	args := sharedmodel.Transaction{Account: t}
	session := sql.AgentDb
	var dTs []sharedmodel.Transaction

	err := session.Where(&args).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) AllTransactions(start, end int64) ([]sharedmodel.Transaction, error) {
	session := sql.FinanceDB
	var dTs []sharedmodel.Transaction

	err := session.Where("created_at >= ? AND created_at <= ?", start, end).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) AllFinTransactions(start, end int64) ([]sharedmodel.Transaction, error) {
	session := sql.FinanceDB
	var dTs []sharedmodel.Transaction

	err := session.Where("created_at >= ? AND created_at <= ?", start, end).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) AllIncomeTransactions(walletId string, start, end int64) ([]sharedmodel.Transaction, error) {
	session := sql.FinanceDB
	var dTs []sharedmodel.Transaction
	err := session.Where("account = ? AND created_at >= ? AND created_at <= ?", walletId, start, end).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) AllWalletTransactions(walletId string) ([]sharedmodel.Transaction, error) {
	session := sql.FinanceDB
	var dTs []sharedmodel.Transaction
	err := session.Where("account = ?", walletId).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) AllAgentFundings(agentId string, start, end int64) ([]sharedmodel.Transaction, error) {
	session := sql.FinanceDB
	var dTs []sharedmodel.Transaction
	err := session.Where("account = ? AND created_at >= ? AND created_at <= ?", agentId, start, end).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) AllGames() ([]sharedmodel.GameEntry, error) {
	session := sql.USSD
	var dTs []sharedmodel.GameEntry

	err := session.Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) FindWallets(arg map[string]interface{}) ([]sharedmodel.Wallet, error) {
	session := sql.FinanceDB
	var results []sharedmodel.Wallet
	err := session.Where(arg).Order("created_at").Find(&results).Error
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (sql *SqlLayer) AllFinGames(start, end int64) ([]sharedmodel.GameEntry, error) {
	session := sql.USSD
	var dTs []sharedmodel.GameEntry

	err := session.Where("time >= ? AND time <= ?", start, end).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) DefaultTransactions() ([]sharedmodel.Transaction, error) {
	args := sharedmodel.Transaction{Account: "0907"}
	session := sql.AgentDb
	var dTs []sharedmodel.Transaction

	err := session.Where(args).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) GetAgentAssignments(agentId string) ([]sharedmodel.TargetAssignment, error) {
	args := sharedmodel.TargetAssignment{Supervisor: agentId}
	session := sql.Supervisor
	var dTs []sharedmodel.TargetAssignment

	err := session.Where(args).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) GetAAssignments(id string) (*sharedmodel.TargetAssignment, error) {
	args := sharedmodel.TargetAssignment{Id: id}
	session := sql.Supervisor
	var dTs sharedmodel.TargetAssignment

	err := session.Where(args).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return &dTs, nil
}

func (sql *SqlLayer) AllAssignments() ([]sharedmodel.AssignmentQuery, error) {
	session := sql.Supervisor
	var result []sharedmodel.AssignmentQuery
	var dTs []sharedmodel.TargetAssignment
	err := session.Find(&dTs).Error
	if err != nil {
		return nil, err
	}

	for _, v := range dTs {
		target, err := sql.GetATarget(v.Target)
		if err != nil {
			return nil, err
		}
		result = append(result, sharedmodel.AssignmentQuery{Target: *target, Assignment: v})
	}
	return result, nil
}

func (sql *SqlLayer) AgentProfile(agentId string) (*sharedmodel.Agent, error) {
	args := sharedmodel.Agent{Id: agentId}
	session := sql.AgentDb
	var dTs sharedmodel.Agent

	err := session.Where(args).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return &dTs, nil
}

func (sql *SqlLayer) GetATarget(targetId string) (*sharedmodel.SupervisorTarget, error) {
	args := sharedmodel.SupervisorTarget{Id: targetId}
	session := sql.Supervisor
	var dTs sharedmodel.SupervisorTarget

	err := session.Where(args).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return &dTs, nil
}

func (sql *SqlLayer) SupervisorProfile(agentId string) (*sharedmodel.Supervisor, error) {
	args := sharedmodel.Supervisor{Id: agentId}
	session := sql.Supervisor
	var dTs sharedmodel.Supervisor

	err := session.Where(args).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return &dTs, nil
}

func (sql *SqlLayer) AllAgents() ([]sharedmodel.Agent, error) {
	session := sql.AgentDb
	var dTs []sharedmodel.Agent

	err := session.Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) FindAgnetWithPhone(phone string) ([]sharedmodel.Agent, error) {
	args := sharedmodel.Agent{Phone: phone}
	session := sql.AgentDb
	var dTs []sharedmodel.Agent
	err := session.Where(args).Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) AllSupervisors() ([]sharedmodel.Supervisor, error) {
	session := sql.Supervisor
	var dTs []sharedmodel.Supervisor

	err := session.Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) GetAllParnet() ([]sharedmodel.Partner, error) {
	session := sql.AdminDB
	var dTs []sharedmodel.Partner

	err := session.Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}

func (sql *SqlLayer) GetAllAdmin() ([]sharedmodel.AdminAccount, error) {
	session := sql.AdminDB
	var dTs []sharedmodel.AdminAccount

	err := session.Find(&dTs).Error
	if err != nil {
		return nil, err
	}
	return dTs, nil
}
func (sql *SqlLayer) GetParnet(a *sharedmodel.Partner) (sharedmodel.Partner, error) {
	session := sql.AdminDB
	var dW sharedmodel.Partner
	err := session.Where(a).First(&dW).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return dW, gorm.ErrRecordNotFound
	}
	return dW, err
}

func (sql *SqlLayer) GetAdmin(a *sharedmodel.AdminAccount) (sharedmodel.AdminAccount, error) {
	session := sql.AdminDB
	var dW sharedmodel.AdminAccount
	err := session.Where(a).First(&dW).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return dW, gorm.ErrRecordNotFound
	}
	return dW, err
}

func (sql *SqlLayer) AddParnet(vb *sharedmodel.Partner) (uint64, error) {
	err := sql.AdminDB.Create(&vb).Error
	if err != nil {
		return 00, err
	}
	return vb.Id, err
}

func (sql *SqlLayer) UpdateParnet(a *sharedmodel.Partner, b *sharedmodel.Partner) error {
	session := sql.AdminDB
	return session.Model(&a).Updates(b).Error
}

func (sql *SqlLayer) UpdateAdmin(old *sharedmodel.AdminAccount, new sharedmodel.AdminAccount) error {
	session := sql.AdminDB
	if old.ReadOnly != new.ReadOnly {
		session.Model(&old).Updates(map[string]interface{}{"read_only": new.ReadOnly})
	}
	if old.Status != new.Status {
		session.Model(&old).Updates(map[string]interface{}{"status": new.Status})
	}
	return session.Model(&old).Updates(new).Error
}

//TODO
// Move Partners to admin DB
func (sql *SqlLayer) UpdatePartnerMap(a *sharedmodel.Partner, dict map[string]interface{}) error {
	session := sql.AdminDB
	return session.Model(&a).Updates(dict).Error
}

// UpdateVoucher
func (sql *SqlLayer) UpdateAgentMap(a *sharedmodel.Agent, dict map[string]interface{}) error {
	session := sql.AgentDb
	return session.Model(&a).Updates(dict).Error
}

func (sql *SqlLayer) UpdateSupervisorMap(a *sharedmodel.Supervisor, dict map[string]interface{}) error {
	session := sql.Supervisor
	return session.Model(&a).Updates(dict).Error
}

func (sql *SqlLayer) UpdateAssignmentMap(a *sharedmodel.TargetAssignment, dict map[string]interface{}) error {
	session := sql.Supervisor
	return session.Model(&a).Updates(dict).Error
}

func (sql *SqlLayer) FindAgent(a *sharedmodel.Agent) (*sharedmodel.Agent, error) {
	session := sql.AgentDb
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

func (sql *SqlLayer) SupervisorAgents(id string) ([]sharedmodel.Agent, error) {
	option := sharedmodel.Agent{Supervisor: id}
	session := sql.AgentDb
	var result []sharedmodel.Agent

	err := session.Where(option).Find(&result).Error
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (sql *SqlLayer) GetAgentTargets(id string) ([]sharedmodel.AgentTargetAssignment, error) {
	option := models.AgentTargetPayload{AgentId: id}
	session := sql.AgentDb

	var result []sharedmodel.AgentTargetAssignment

	err := session.Where(option).Find(&result).Error

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (sql *SqlLayer) UpdateAgentTargets(id string, agent sharedmodel.AgentTargetAssignment) ([]sharedmodel.AgentTargetAssignment, error) {
	option := sharedmodel.AgentTargetAssignment{}
	session := sql.AgentDb

	var result []sharedmodel.AgentTargetAssignment

	err := session.Where(option).Find(&result).Save(agent).Error

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (sql *SqlLayer) AddPlayDenominaton(payload models.ScratchPlayDenominations) ([]models.ScratchPlayDenominations, error) {
	session := sql.AdminDB
	session.AutoMigrate(&models.ScratchPlayDenominations{})

	var a []models.ScratchPlayDenominations

	reg := &models.ScratchPlayDenominations{ID: payload.ID, Amount: payload.Amount, WinningCount: payload.WinningCount, AmountWon: payload.AmountWon}

	am := session.Create(reg).Find(&a)

	return a, am.Error
}

func (sql *SqlLayer) GetPlayDenominations() ([]models.ScratchPlayDenominations, error) {
	session := sql.AdminDB
	option := models.ScratchPlayDenominations{}

	var result []models.ScratchPlayDenominations

	err := session.Where(option).Find(&result).Error

	if err != nil {
		return nil, err
	}

	return result, err
}

func (sql *SqlLayer) DeletePlayDenomination(req models.ScratchPlayDenominations) ([]models.ScratchPlayDenominations, error) {
	session := sql.AdminDB
	option := req

	var result []models.ScratchPlayDenominations

	err := session.Where(option).Delete(&result).Error

	if err != nil {
		return nil, err
	}

	return result, err
}

func (sql *SqlLayer) UpdatePlayDenomination(req models.ScratchPlayDenominations) ([]models.ScratchPlayDenominations, error) {
	session := sql.AdminDB
	var result []models.ScratchPlayDenominations

	err := session.Model(&models.ScratchPlayDenominations{}).Where("id = ?", req.ID).Update("amount", req.Amount).Update("amount_won", req.AmountWon).Update("winning_count", req.WinningCount).Find(&result).Error

	if err != nil {
		return nil, err
	}

	return result, err
}

func (sql *SqlLayer) GetGlobalAgentTargets() ([]models.AgentsTargetInformation, error) {
	session := sql.AdminDB
	var result []models.AgentsTargetInformation

	err := session.Model(&models.AgentsTargetInformation{}).Find(&result).Error

	if len(result) == 0 {
		reg := &models.AgentsTargetInformation{ID: 1, Minimum: 0, Reward: 0}
		session.Create(reg).Find(&result)
	}

	if err != nil {
		return nil, err
	}

	return result, err
}

func (sql *SqlLayer) ChangeGlobalAgentTarget(req models.AgentsTargetInformation) ([]models.AgentsTargetInformation, error) {
	session := sql.AdminDB
	var result []models.AgentsTargetInformation

	reg := &models.AgentsTargetInformation{ID: 1, Minimum: req.Minimum, Reward: req.Reward}
	err := session.Save(reg).Find(&result).Error

	if err != nil {
		return nil, err
	}

	return result, err
}

func (sql *SqlLayer) GetSupervisorAmountCount() ([]models.SupervisorAmountCount, error) {
	session := sql.AdminDB
	var result []models.SupervisorAmountCount

	err := session.Model(&models.SupervisorAmountCount{}).Find(&result).Error

	if err != nil {
		return nil, err
	}

	return result, err
}

func (sql *SqlLayer) UpdateSupervisorAmountCount(data models.SupervisorAmountCount) ([]models.SupervisorAmountCount, error) {
	session := sql.AdminDB
	var result []models.SupervisorAmountCount

	reg := &models.SupervisorAmountCount{Id: "1", Count: data.Count}
	err := session.Save(reg).Find(&result).Error

	if err != nil {
		return nil, err
	}

	return result, err
}
